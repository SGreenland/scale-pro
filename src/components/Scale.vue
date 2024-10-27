<template>
  <div class="w-full pt-5" ref="dragSelectArea">
    <div
      class="relative piano-roll grid max-sm:text-xs lg:w-2/3 w-full m-auto"
      :style="{
        gridTemplateColumns: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(13, minmax(0, 1.8rem))`,
      }"
    >
      <div
        class="grid col-[2_/_-1] row-span-full"
        :style="{
          background: `linear-gradient(90deg, ${gridLineColor} 1px, transparent 1px)`,
          backgroundSize: `${cellWidth}px 100%`,
        }"
      ></div>
      <div
        v-for="(note, index) in scaleToDisplay"
        :key="index"
        ref="noteElements"
        :id="index.toString()"
        class="bg-blue-100 border border-blue-300 shadow rounded-2xl size-full flex items-center justify-center cursor-pointer dark:bg-blue-700 dark:text-white"
        :style="{
          gridRowStart:
            13 - scales[scaleConfig.selectedScale][note.interval - 1],
          gridColumnStart: index + 1,
        }"
      >
        <span class="select-none"
          >{{ getNoteName(note.name)
          }}<small>({{ note.interval }})</small></span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { Note, Scales } from "../types";
import { scales } from "../NotesAndScales";
import DragSelect, { DSInputElement } from "dragselect";
import { playBackOptions, workoutConfig, scaleConfig, scaleToDisplay, tempo } from "../GlobalState";
import { notes } from "../NotesAndScales";

const noteElements = ref<HTMLElement[]>();
const audioIsPlaying = ref(false);
const audioBuffers = ref<AudioBuffer[]>([]);
const audioContext = new window.AudioContext();
const animationInterval = computed(() => 60000 / +tempo.value / 1000); // Convert to seconds
const noteIndex = ref(0);
const direction = ref(1);
let animationFrameId: number | null = null;
const ds = ref<DragSelect<DSInputElement> | null>(null);
const noteSelection = ref<Note[]>([]);
const dragSelectArea = ref<HTMLElement | undefined>();
const gridLineColor: string =
  window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "rgb(17 24 39)"
    : "white";
const cellWidth = ref<number>(0);
const workoutInProgress = ref(false);

function getNoteName(note: string) {
  if (note.includes("sharp")) {
    return note.replace("sharp", "#");
  }
  return note;
}

const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

const preloadAudio = async () => {
  const loadedAudios = await Promise.all(
    scaleToDisplay.value.map((note) => loadAudioBuffer(note.audioSrc))
  );

  // todo: if workout mode, load all notes from scales in workout.

  audioBuffers.value = loadedAudios;

  // warm up audioContext by playing a silent buffer
  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);
};

const playNote = (index: number, time: number) => {
  const audioBuffer = audioBuffers.value[index];
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(time);

  const noteElement = document.getElementById(index.toString());
  if (noteElement) {
    noteElement.style.animation = `bounce ${
      animationInterval.value * 1000
    }ms linear 1`;
    // remove animation after it finishes
    setTimeout(() => {
      noteElement.style.animation = "";
    }, animationInterval.value * 1000);
  }
};

watch(
  () => scaleToDisplay.value,
  () => {
    preloadAudio();
    ds.value?.clearSelection();
    nextTick(() => {
      cellWidth.value = noteElements.value![0].getBoundingClientRect().width;
      ds.value?.addSelectables(noteElements.value!);
    });
  },
  {
    deep: true,
    immediate: true,
  }
);

const scheduleNotes = (startTime: number) => {
  let currentTime = startTime;
  let currentNoteIndex = noteIndex.value;
  let currentDirection = direction.value;

  while (currentTime < audioContext.currentTime + 0.1) {
    // Schedule ahead of time (100ms)

    playNote(currentNoteIndex, currentTime);

    currentTime += animationInterval.value;
    currentNoteIndex += currentDirection;

    // reached the end of the scale
    if (
      currentDirection === 1 &&
      (currentNoteIndex === scaleToDisplay.value.length ||
        currentNoteIndex ===
          scaleToDisplay.value.indexOf(
            noteSelection.value[noteSelection.value.length - 1]
          ) +
            1) // reached the end of the selection
    ) {
      if (playBackOptions.isRoundTrip) {
        currentDirection = -1;
        currentNoteIndex -= 2; // step back to the previous note
      } else if (playBackOptions.shouldLoop) {
        // pause for two beats before looping - maybe make this a setting
        currentTime += animationInterval.value * 2;
        currentNoteIndex = noteSelection.value.length
          ? scaleToDisplay.value.indexOf(noteSelection.value[0])
          : 0;
      } else {
        audioIsPlaying.value = false;
        break;
      }
    } else if (
      currentDirection === -1 &&
      (currentNoteIndex === -1 ||
        currentNoteIndex ===
          scaleToDisplay.value.indexOf(noteSelection.value[0]) - 1)
    ) {
      if (playBackOptions.isRoundTrip && playBackOptions.shouldLoop) {
        // pause for one beat before looping
        currentTime += animationInterval.value;
        currentDirection = 1;
        currentNoteIndex = noteSelection.value.length
          ? scaleToDisplay.value.indexOf(noteSelection.value[0])
          : 0;
      } else if (playBackOptions.shouldLoop) {
        currentNoteIndex = scaleToDisplay.value.length - 1;
      } else {
        audioIsPlaying.value = false;
        break;
      }
    }
  }

  noteIndex.value = currentNoteIndex;
  direction.value = currentDirection;

  if (audioIsPlaying.value) {
    animationFrameId = requestAnimationFrame(() => scheduleNotes(currentTime));
  }
};

const toggleAudio = async () => {
  if (!audioIsPlaying.value) {
    audioIsPlaying.value = true;
    noteIndex.value = noteSelection.value.length
      ? scaleToDisplay.value.indexOf(noteSelection.value[0])
      : 0;
    direction.value = 1;
    scheduleNotes(audioContext.currentTime);
  } else {
    audioIsPlaying.value = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
};

onMounted(() => {
  window.addEventListener("visibilitychange", preloadAudio);
  window.addEventListener("resize", () => {
    cellWidth.value = noteElements.value![0]?.getBoundingClientRect().width;
  });

  nextTick(() => {
    ds.value = new DragSelect({
      area: dragSelectArea.value,
      draggability: false,
      selectedClass:
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark:bg-orange-700"
          : "bg-blue-300",
    });
    ds.value.addSelectables(noteElements.value!);
    //events
    ds.value.subscribe("DS:start", (e) => {
      if (!e.isDragging) {
        // @ts-ignore
        // if a note is clicked, play it
        if (e.items[0]) playNote(e.items[0].id, 0);
        ds.value?.clearSelection();
      }
    });
    ds.value.subscribe("DS:end", (e) => {
      const selected = e.items.map((item) =>
        item.textContent?.replace(/\(.*\)/, "").trim()
      );
      noteSelection.value = selected.map((note) => {
        return scaleToDisplay.value.find(
          (n) => getNoteName(n.name) === note
        ) as Note;
      });

      //sort in same order as scale
      noteSelection.value = scaleToDisplay.value.filter((note) =>
        noteSelection.value.includes(note)
      );
    });

    ds.value?.subscribe("DS:unselect", (e) => {
      const selected = e.items.map((item) =>
        item.textContent?.replace(/\(.*\)/, "").trim()
      );
      noteSelection.value = noteSelection.value.filter((note) => {
        return !selected.includes(getNoteName(note.name));
      });
    });
  });
});

const scaleDuration = computed(() => (scaleToDisplay.value.length * 2 * 60100) / +tempo.value);

function toggleWorkout() {
  let direction = 1;
  let interval = 0;

  workoutInProgress.value = !workoutInProgress.value;

  if (workoutInProgress.value) {
    console.log("workout started");
    setTimeout(() => {
      toggleAudio();
    }, 100);

    // while selected note is not end note, change note after each scale repitition
    interval = setInterval(() => {
      if (!workoutInProgress.value) {
        clearInterval(interval);
        return;
      }
      // selectedNote index
      const selectedNoteIndex = notes.findIndex(
        (note) => note.name === scaleConfig.selectedNote
      );
      // if selectedNote is not endNote, increment selectedNote
      if (
        scaleConfig.selectedNote !== workoutConfig.endNote &&
        direction === 1
      ) {
        // change note to current selected note index + 1
        scaleConfig.selectedNote = notes[selectedNoteIndex + direction].name;
        // change direction if end note reached
        if (scaleConfig.selectedNote === workoutConfig.endNote) {
          direction = -1;
        }
        //toggle audio
        setTimeout(() => {
          toggleAudio();
        }, 100);
      } else if (
        scaleConfig.selectedNote !== workoutConfig.startNote &&
        workoutConfig.roundTrip
      ) {
        // if selectedNote is not startNote, decrement selectedNote
        scaleConfig.selectedNote = notes[selectedNoteIndex + direction].name;
        //toggle audio
        setTimeout(() => {
          toggleAudio();
        }, 100);
      } else {
        // if selectedNote is endNote and no multiple scales, workout is complete
        if (workoutConfig.scales.length === 1) {
          clearInterval(interval);
          workoutInProgress.value = false;
          // reset to start note after workout is complete
          setTimeout(() => {
            scaleConfig.selectedNote = workoutConfig.startNote;
          }, scaleDuration.value);
          return;
        }
        if (workoutConfig.scales.length > 1) {
          const currentScaleIndex = workoutConfig.scales.indexOf(
            scaleConfig.selectedScale
          );
          if (currentScaleIndex + 1 < workoutConfig.scales.length) {
            //@ts-ignore
            scaleConfig.selectedScale =
              workoutConfig.scales[currentScaleIndex + 1];
            console.log(scaleConfig.selectedScale);
            clearInterval(interval);
            workoutInProgress.value = false;
            //going wrong here
            console.log("toggling workout again");
            toggleWorkout();
          } else {
            workoutInProgress.value = false;
            clearInterval(interval);
            //@ts-ignore
            scaleConfig.selectedScale = workoutConfig.scales[0];
          }
        } else {
          // reset to start note after workout is complete
          setTimeout(() => {
            scaleConfig.selectedNote = workoutConfig.startNote;
          }, scaleDuration.value);
        }
      }
    }, scaleDuration.value);
  } else {
    clearInterval(interval);
    //toggle audio
    toggleAudio();
  }
}

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener("visibilitychange", preloadAudio);
  // not sure if this unsubscribes but hopefully?
  ds.value?.stop();
});

defineExpose({
  toggleAudio,
  toggleWorkout,
  audioIsPlaying,
});
</script>

<style>
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}

.piano-roll {
  background: repeating-linear-gradient(
    180deg,
    rgb(245 245 245),
    rgb(245 245 245) 1.8rem,
    rgb(229 229 229) 1.8rem,
    rgb(229 229 229) 3.6rem
  );
}

@media (prefers-color-scheme: dark) {
  .piano-roll {
    background: repeating-linear-gradient(
      180deg,
      #1a202c,
      #1a202c 1.8rem,
      #2d3748 1.8rem,
      #2d3748 3.6rem
    );
  }
}
</style>
