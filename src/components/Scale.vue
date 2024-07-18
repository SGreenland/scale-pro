<template>
  <div class="w-full" ref="dragSelectArea">
    <div class="relative">
      <div v-for="(note, index) in scaleToDisplay" class="absolute z-0 left-0 w-full border-t border-stone-300 dark:border-stone-800"
        :style="{ top: 'calc(' + (index) * (100 / scaleToDisplay.length) + '% + 11px' }"></div>

      <div
        class="z-10 relative grid my-6 max-sm:text-xs gap-x-2 justify-center items-center lg:w-2/3 w-full m-auto max-w-3xl px-6"
        :style="{
          gridTemplateColumns: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
        }">
        <div v-for="(note, index) in scaleToDisplay" :key="index" ref="notes"
          class="w-auto  h-6 flex items-center justify-center cursor-pointer group" :style="{
            gridRowStart: scaleToDisplay.length - note.interval + 1,
            gridColumnStart: index + 1,
          }">
          <span
            class="font-bold text-sm rounded-full h-5 w-12 bg-cyan-600 text-white | dark:bg-stone-300 dark:text-black select-none group-[.current]:bg-cyan-300">{{
              getNoteName(note.name) }}
            <!-- <small>({{ note.interval }})</small> -->
          </span>
        </div>
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
import { Note } from "../types";
import DragSelect, { DSInputElement } from "dragselect";

const props = defineProps<{
  scaleToDisplay: Note[];
  tempo: string;
}>();

const notes = ref<HTMLElement[]>();
const audioIsPlaying = ref(false);
const audioBuffers = ref<AudioBuffer[]>([]);
const audioContext = new window.AudioContext();
// const isContextResumed = ref(false);
const isForwardsAndBackwards = ref(false);
const shouldLoop = ref(false);
const animationInterval = computed(() => 60000 / +props.tempo / 1000); // Convert to seconds
const noteIndex = ref(0);
const direction = ref(1);
let animationFrameId: number | null = null;
const ds = ref<DragSelect<DSInputElement> | null>(null);
const noteSelection = ref<Note[]>([]);
const dragSelectArea = ref<HTMLElement | undefined>();

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
    props.scaleToDisplay.map((note) => loadAudioBuffer(note.audioSrc))
  );

  audioBuffers.value = loadedAudios;

  // warm up audioContext by playing a silent buffer
  const buffer = audioContext.createBuffer(1, 1, 22050);
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(0);

};

// const resumeAudioContext = async () => {
//   if (audioContext.state === "suspended") {
//     await audioContext.resume();
//   }
//   isContextResumed.value = true;
// };

const playNote = (index: number, time: number) => {
  const audioBuffer = audioBuffers.value[index];
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(time);

  const noteElement = notes.value![index];
  if (noteElement) {
    noteElement.style.animation = `bounce ${animationInterval.value * 1000
      }ms linear 1`;
    noteElement.classList.add('current')
    // remove animation after it finishes
    setTimeout(() => {
      noteElement.style.animation = "";
      noteElement.classList.remove('current')

    }, animationInterval.value * 1000);
  }
};

watch(() => props.scaleToDisplay, () => {
  preloadAudio();
  ds.value?.clearSelection();
  nextTick(() => {
    ds.value?.addSelectables(notes.value!);
  });
}, {
  deep: true,
  immediate: true,
});

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
      (currentNoteIndex === props.scaleToDisplay.length ||
        currentNoteIndex ===
        props.scaleToDisplay.indexOf(
          noteSelection.value[noteSelection.value.length - 1]
        ) +
        1) // reached the end of the selection
    ) {
      if (isForwardsAndBackwards.value) {
        currentDirection = -1;
        currentNoteIndex -= 2; // step back to the previous note
      } else if (shouldLoop.value) {
        // pause for two beats before looping - maybe make this a setting
        currentTime += animationInterval.value * 2;
        currentNoteIndex = noteSelection.value.length
          ? props.scaleToDisplay.indexOf(noteSelection.value[0])
          : 0;
      } else {
        audioIsPlaying.value = false;
        break;
      }
    } else if (
      currentDirection === -1 &&
      (currentNoteIndex === -1 ||
        currentNoteIndex ===
        props.scaleToDisplay.indexOf(noteSelection.value[0]) - 1)
    ) {
      if (isForwardsAndBackwards.value && shouldLoop.value) {
        // pause for one beat before looping
        currentTime += animationInterval.value;
        currentDirection = 1;
        currentNoteIndex = noteSelection.value.length
          ? props.scaleToDisplay.indexOf(noteSelection.value[0])
          : 0;
      } else if (shouldLoop.value) {
        currentNoteIndex = props.scaleToDisplay.length - 1;
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

const toggleAudio = async (forwardsAndBackwards: boolean, loop: boolean) => {
  isForwardsAndBackwards.value = forwardsAndBackwards;
  shouldLoop.value = loop;
  if (!audioIsPlaying.value) {
    audioIsPlaying.value = true;
    noteIndex.value = noteSelection.value.length
      ? props.scaleToDisplay.indexOf(noteSelection.value[0])
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

  nextTick(() => {
    ds.value = new DragSelect({
      area: dragSelectArea.value,
      draggability: false,
      selectedClass: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark:bg-orange-700" : "bg-blue-300",
    });
    ds.value.addSelectables(notes.value!);
    //events
    ds.value.subscribe("DS:start", (e) => {
      if (!e.isDragging) {
        // @ts-ignore
        const noteIndex = notes.value?.indexOf(e.items[0]);
        // if a note is clicked, play it
        if (noteIndex !== undefined) playNote(noteIndex, 0);
        ds.value?.clearSelection();
      }
    });
    ds.value.subscribe("DS:end", (e) => {
      const selected = e.items.map((item) =>
        item.textContent?.replace(/\(.*\)/, "").trim()
      );
      noteSelection.value = selected.map((note) => {
        return props.scaleToDisplay.find(
          (n) => getNoteName(n.name) === note
        ) as Note;
      });

      //sort in same order as scale
      noteSelection.value = props.scaleToDisplay.filter((note) =>
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
</style>
