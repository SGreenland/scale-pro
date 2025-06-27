<template>
  <div
    class="w-full relative"
    :class="{
      'pt-4': selectedGridType === 'Guitar tab',
    }"
    ref="dragSelectArea"
  >
    <PitchAccuracyModal
    v-if="showPitchModal && !showInfoModal"
    :isNoData="!pitchData.length"
    :averageDeviation="pitchStats.averageDeviation"
    :inTunePercentage="pitchStats.inTunePercentage"
    @close="showPitchModal = false"
  />
   <PitchTrackingInfoModal
      v-if="showInfoModal && !showPitchModal"
      @close="showInfoModal = false"
    />
    <!-- for each grid cell create a border top if guitar mode-->
    <div
      class="lg:w-2/3 w-full absolute left-0 right-0 m-auto z-10"
      v-if="selectedGridType === 'Guitar tab'"
    >
      <div
        class="border-t border-t-gray-600 h-[1.8rem]"
        :class="{ 'border-b border-b-gray-600': index === gridRows - 1 }"
        v-for="index in gridRows - 1"
        :key="index"
      ></div>
    </div>
    <div
      class="relative grid max-sm:text-xs lg:w-2/3 w-full m-auto"
      :class="selectedGridType === 'Guitar tab' ? 'fretboard' : 'piano-roll'"
      :style="{
        gridTemplateColumns: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridRows}, minmax(0, 1.8rem))`,
      }"
    >
      <div
        class="grid col-[2_/_-1] row-span-full"
        :class="{'grid-pattern': selectedGridType === 'Piano roll'}"
        :style="{
          backgroundSize: `${cellWidth}px 100%`,
        }"
      ></div>
      <div
        v-for="(note, index) in scaleToDisplay"
        :key="index"
        ref="noteElements"
        @click="playNote(index, 0)"
        :id="index.toString()"
        class="bg-sky-200 border border-indigo-500 shadow rounded-2xl size-full flex items-center justify-center cursor-pointer dark:bg-cyan-700 dark:text-white"
        :class="{
          'relative bottom-4 w-1/2 h-5/6 m-auto z-50':
            selectedGridType === 'Guitar tab',
        }"
        :style="{
          gridRowStart:
            selectedGridType !== 'Guitar tab'
              ? gridRows - scales[scaleConfig.selectedScale][note.position]
              : note.guitarPositions[note.currentGtrPositionIndex]['string'],
          gridColumnStart: index + 1,
        }"
      >
        <span class="select-none"
          >{{
            selectedGridType !== "Guitar tab"
              ? getNoteName(note.name)
              : note.guitarPositions[note.currentGtrPositionIndex]["fret"]
          }}
        </span>
      </div>
      <canvas
        v-if="selectedGridType === 'Piano roll'"
        ref="pitchCanvas"
        class="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
      >
      </canvas>
    </div>
    <div class="lg:w-2/3 w-full m-auto flex justify-end">
      <button
        v-if="selectedGridType == 'Guitar tab'"
        :disabled="scaleConfig.noteOrder == null ? false : true"
        class="w-fit h-9 flex items-center justify-center inverted-btn rounded-full"
        @click="findAlternateFretPositions"
      >
        Find Alt. Frets
      </button>
      <div v-else class="mt-4 flex items-center gap-2 max-sm:mx-auto">
        <FontAwesomeIcon
          v-if="!pitchData.length"
          :icon="faCircleQuestion"
          class="text-indigo-500 hover:text-indigo-600 cursor-pointer"
          @click="showInfoModal = true"
          size="xl"
        />
        <button :disabled="!isPitchTracking && pitchData.length > 0" class="flex items-center gap-2" @click="togglePitchTracking">
          <div
            class="bg-red-500 size-4 rounded-full"
            :class="{ 'animate-[radar_1s_ease-in-out_infinite]': isPitchTracking }"
          ></div>
          {{ (isPitchTracking ? "Stop " : "Start ") + "Pitch Tracking" }}
        </button>
        <button
          class="inverted-btn rounded-full"
          v-if="!isPitchTracking && pitchData.length"
          @click="clearPitchData"
        >
          Clear Pitch Data
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DragSelect, { DSInputElement } from "dragselect";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  computedLoopGap,
  isLoadingAudio,
  playBackOptions,
  scaleConfig,
  scaleToDisplay,
  selectedGridType,
  tempo,
  validGtrPatternsForCurrentScale,
  workoutConfig,
  computedMaxCents,
} from "../GlobalState";
import { notes, scales } from "../NotesAndScales";
import PitchAccuracyModal from "../components/PitchAccuracyModal.vue";
import { usePitchTracker } from "../composables/usePitchTracker";
import { Note } from "../types";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PitchTrackingInfoModal from "./PitchTrackingInfoModal.vue";

const audioContext = new window.AudioContext();
const { pitchData, startTracking, stopTracking } =
  usePitchTracker(audioContext);

// const props = defineProps<{
//   workoutMode: boolean;
// }>();

const gridRows = computed(() => {
  return selectedGridType.value !== "Guitar tab" ? 13 : 6;
});

const pitchCanvas = ref<HTMLCanvasElement | null>(null);

const noteElements = ref<HTMLElement[]>();
const audioIsPlaying = ref(false);
const audioBuffers = ref<AudioBuffer[]>([]);
const animationInterval = computed(() => 60000 / tempo.value / 1000 / 2); // Convert to seconds
const noteIndex = ref(0);
const direction = ref(1);
let animationFrameId: number | null = null;
const ds = ref<DragSelect<DSInputElement> | null>(null);
const noteSelection = ref<Note[]>([]);
const dragSelectArea = ref<HTMLElement | undefined>();
const cellWidth = ref<number>(0);
const workoutInProgress = ref(false);
const showInfoModal = ref(false);

function getNoteName(note: string) {
  if (note.includes("sharp")) {
    return note.replace("sharp", "#");
  }
  return note;
}

const selectedPattern = ref<number[]>([]);

function findAlternateFretPositions() {
  if (!selectedPattern.value.length) {
    selectedPattern.value =
      validGtrPatternsForCurrentScale.value[
        validGtrPatternsForCurrentScale.value.length - 1
      ];
  } else {
    const currentIndex = validGtrPatternsForCurrentScale.value.findIndex(
      (pattern) => pattern.toString() === selectedPattern.value.toString()
    );
    if (currentIndex === -1) {
      selectedPattern.value =
        validGtrPatternsForCurrentScale.value[
          validGtrPatternsForCurrentScale.value.length - 1
        ];
    } else {
      // Move to the next pattern, or loop back to the first
      selectedPattern.value =
        validGtrPatternsForCurrentScale.value[
          (currentIndex + 1) % validGtrPatternsForCurrentScale.value.length
        ];
    }
  }
  // Step 3: Assign valid positions based on the pattern
  const newPositions = scaleToDisplay.value.map((note, noteIndex) => {
    const expectedString = selectedPattern.value[noteIndex];
    const matchingPositions = note.guitarPositions
      .map((pos, i) => ({ ...pos, index: i }))
      .filter((pos) => pos.string === expectedString);

    // Should always be non-empty due to pre-filter
    const random = Math.floor(Math.random() * matchingPositions.length);
    return matchingPositions[random].index;
  });

  // Step 4: Apply changes
  scaleToDisplay.value.forEach((note, i) => {
    note.currentGtrPositionIndex = newPositions[i];
  });

  scaleConfig.currentGtrPositions = newPositions;
}

const loadAudioBuffer = async (url: string): Promise<AudioBuffer> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
};

const preloadAudio = async () => {
  isLoadingAudio.value = true;
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
  isLoadingAudio.value = false;
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

const startTime = ref<number | null>(null);
const isPitchTracking = ref(false);
const showPitchModal = ref(false);
const pitchStats = ref({ averageDeviation: 0, inTunePercentage: 0 });

function togglePitchTracking() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  isPitchTracking.value = !isPitchTracking.value;

  if (startTime.value === null) {
    startTrackingWithAnchor();
  } else {
    stopTracking();
    startTime.value = null;

    // Define time and cents thresholds
    // const sampleDuration = 0.06;
    const maxCents: number = computedMaxCents.value

    const noteBuckets = new Map<
      string,
      { accuracySum: number; duration: number; count: number }
    >();

    for (const data of pitchData.value) {
      const pitch = data.pitch;
      const volume = data.volume ?? 1;

      const closestNote = scaleToDisplay.value.reduce((prev, curr) =>
        Math.abs(curr.frequency - pitch) < Math.abs(prev.frequency - pitch)
          ? curr
          : prev
      );

      const centsOff = 1200 * Math.log2(pitch / closestNote.frequency);
      const absCents = Math.abs(centsOff);
      const accuracy = Math.max(0, 1 - absCents / maxCents);
      const weight = volume;

      if (!noteBuckets.has(closestNote.name)) {
        noteBuckets.set(closestNote.name, {
          accuracySum: 0,
          duration: 0,
          count: 0,
        });
      }

      const entry = noteBuckets.get(closestNote.name)!;
      entry.accuracySum += accuracy * weight;
      entry.duration += weight;
      entry.count += 1;
    }

    if (noteBuckets.size === 0) {
      showPitchModal.value = true;
      return;
    }

    const perNote = Array.from(noteBuckets.entries()).map(
      ([note, { accuracySum, duration }]) => ({
        note,
        avgAccuracy: accuracySum / duration,
        duration,
      })
    );

    const totalDuration = perNote.reduce((sum, n) => sum + n.duration, 0);
    const weightedAccuracy =
      perNote.reduce((sum, n) => sum + n.avgAccuracy * n.duration, 0) /
      totalDuration;

    const noteCoverage =
      (perNote.length / scaleToDisplay.value.length) * 100;

    const finalInTuneScore = Math.round(
      (weightedAccuracy * 0.7 + noteCoverage / 100 * 0.3) * 100
    );

    // Use this for a simple visual modal now
    pitchStats.value = {
      averageDeviation: Math.round((1 - weightedAccuracy) * maxCents),
      inTunePercentage: finalInTuneScore,
    };

    showPitchModal.value = true;
  }
}


function startTrackingWithAnchor() {
  audioContext.resume();
  startTime.value = audioContext.currentTime;
  startTracking();
}

function drawPitchCurve() {
  if (
    !pitchCanvas.value ||
    !scaleToDisplay.value.length ||
    selectedGridType.value !== "Piano roll"
  ) {
    console.warn("Pitch canvas not ready or no pitch data available.");
    return;
  }

  const canvas = pitchCanvas.value;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Resize canvas to match display size
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  for (const { pitch } of pitchData.value) {
    const closestNote = scaleToDisplay.value.reduce((prev, curr) =>
      Math.abs(curr.frequency - pitch) < Math.abs(prev.frequency - pitch)
        ? curr
        : prev
    );

    const colIndex = scaleToDisplay.value.findIndex(
      (n) => n.name === closestNote.name
    );
    if (colIndex === -1) continue;

    // 1. Use the lowest note in the piano roll as a base
    const baseFreq = Math.min(...scaleToDisplay.value.map((n) => n.frequency));

    const rowHeight = canvas.height / gridRows.value;

    // 2. Calculate semitone offset from the base (e.g., C4)
    const semitoneOffset = 12 * Math.log2(pitch / baseFreq);

    // 3. Calculate Y from semitone offset
    const y = canvas.height - semitoneOffset * rowHeight;

    // 4. Calculate X from time as usual (or just position in scale if snapping column-wise)
    const colWidth = canvas.width / scaleToDisplay.value.length;
    const x = colWidth * colIndex + colWidth / 2;

    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

watch(
  () => pitchData.value,
  () => {
    drawPitchCurve();
  },
  { deep: true }
);

function clearPitchData() {
  pitchData.value = [];
  if (pitchCanvas.value) {
    const ctx = pitchCanvas.value.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, pitchCanvas.value.width, pitchCanvas.value.height);
    }
  }
}

watch(
  () => [scaleToDisplay.value, selectedGridType.value],
  () => {
    preloadAudio();
    ds.value?.clearSelection();
    nextTick(() => {
      cellWidth.value =
        selectedGridType.value !== "Guitar tab"
          ? noteElements.value![0].getBoundingClientRect().width
          : noteElements.value![0].getBoundingClientRect().width * 2;
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

    // reached the end of the scale or selection
    if (
      currentDirection === 1 &&
      (currentNoteIndex === scaleToDisplay.value.length ||
        currentNoteIndex ===
          scaleToDisplay.value.findIndex(
            (note) =>
              noteSelection.value![noteSelection.value.length - 1]?.name ===
              note.name
          ) +
            1)
    ) {
      if (playBackOptions.isRoundTrip) {
        currentDirection = -1;
        currentNoteIndex -= 2; // step back to the previous note
      } else if (playBackOptions.shouldLoop) {
        currentTime += animationInterval.value * computedLoopGap.value;
        currentNoteIndex = noteSelection.value?.length
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
          scaleToDisplay.value.findIndex(
            (note) => noteSelection.value[0]?.name === note.name
          ) -
            1)
    ) {
      if (playBackOptions.isRoundTrip && playBackOptions.shouldLoop) {
        currentTime += animationInterval.value * computedLoopGap.value;
        currentDirection = 1;
        currentNoteIndex = noteSelection.value.length
          ? scaleToDisplay.value.findIndex(
              (note) => noteSelection.value[0]?.name === note.name
            )
          : !computedLoopGap.value
          ? 1
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
    noteIndex.value = noteSelection.value?.length
      ? scaleToDisplay.value.filter((note) =>
          noteSelection.value.includes(note)
        )[0].position - 1
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
});

// watch(() => props.workoutMode, () => {
//   if (!props.workoutMode){
//     nextTick(() => {
//     ds.value = new DragSelect({
//       area: dragSelectArea.value,
//       draggability: false,
//       selectedClass:
//         window.matchMedia &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches
//           ? "dark:bg-orange-700"
//           : "bg-cyan-300",
//     });
//     ds.value.addSelectables(noteElements.value!);
//     //events
//     ds.value.subscribe("DS:start", (e) => {
//       if (!e.isDragging) {
//         // @ts-ignore
//         // if a note is clicked, play it
//         // if (e.items[0]) playNote(e.items[0].id, 0);
//         ds.value?.clearSelection();
//       }
//     });
//     ds.value.subscribe("DS:end", (e) => {
//       const selected = e.items.map((item) =>
//         item.textContent?.replace(/\(.*\)/, "").trim()
//       );
//       noteSelection.value = selected.map((note) => {
//         return scaleToDisplay.value.find(
//           (n) => getNoteName(n.name) === note
//         ) as Note;
//       });

//       //sort in same order as scale
//       noteSelection.value = scaleToDisplay.value.filter((note) =>
//         noteSelection.value.includes(note)
//       );
//     });

//     ds.value?.subscribe("DS:unselect", (e) => {
//       const selected = e.items.map((item) =>
//         item.textContent?.replace(/\(.*\)/, "").trim()
//       );
//       noteSelection.value = noteSelection.value.filter((note) => {
//         return !selected.includes(getNoteName(note.name));
//       });
//     });
//   });
//   }
//   else {
//     ds.value?.stop();
//   }
// }, { immediate: true });

const scaleDuration = computed(
  () => (scaleToDisplay.value.length * 2 * 60100) / +tempo.value
);

let interval: number = 0;

function toggleWorkout() {
  let direction = 1;

  if (interval) {
    clearInterval(interval);
  }
  workoutInProgress.value = !workoutInProgress.value;

  if (workoutInProgress.value) {
    setTimeout(() => {
      toggleAudio();
    }, 100);

    // while selected note is not end note, change note after each scale repitition
    interval = setInterval(() => {
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
        if (workoutConfig.scales.length === 1 && interval) {
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

            workoutInProgress.value = false;
            toggleWorkout();
          } else {
            workoutInProgress.value = false;
            clearInterval(interval);
            //@ts-ignore
            scaleConfig.selectedScale = workoutConfig.scales[0];
          }
        } else {
          clearInterval(interval);
          workoutInProgress.value = false;
          // reset to start note after workout is complete
          setTimeout(() => {
            scaleConfig.selectedNote = workoutConfig.startNote;
          }, scaleDuration.value);
        }
      }
    }, scaleDuration.value);
  } else {
    clearInterval(interval);
    //disable button to give time for timeouts to clear
    isLoadingAudio.value = true;
    setTimeout(() => {
      isLoadingAudio.value = false;
    }, 500);
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
  workoutInProgress,
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

.grid-pattern {
  background: linear-gradient(90deg, white, 1px, transparent 1px);
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

  .grid-pattern {
    background: linear-gradient(90deg, rgb(17 24 39), 1px, transparent 1px);
  }
}
</style>
