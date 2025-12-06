<template>
  <div
    class="w-full relative"
    :class="{
      'pt-4': currentSettings.gridType === 'Guitar tab',
    }"
    ref="dragSelectArea"
    @dragover.prevent
    @drop.prevent
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
      class="w-full absolute left-0 right-0 m-auto z-10"
      v-if="currentSettings.gridType === 'Guitar tab'"
    >
      <div
        class="border-t border-t-gray-600 h-[1.8rem]"
        :class="{ 'border-b border-b-gray-600': index === gridRows - 1 }"
        v-for="index in gridRows - 1"
        :key="index"
      ></div>
    </div>
    <div
      class="relative grid max-sm:text-xs w-full m-auto"
      :class="
        currentSettings.gridType === 'Guitar tab' ? 'fretboard' : 'piano-roll'
      "
      :style="{
        gridTemplateColumns: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${gridRows}, minmax(0, 1.8rem))`,
      }"
    >
      <div
        class="grid col-[2_/_-1] row-span-full"
        :class="{ 'grid-pattern': currentSettings.gridType === 'Piano roll' }"
        :style="{
          backgroundSize: `${cellWidth}px 100%`,
        }"
      ></div>
      <div
        v-if="ghostNote"
        class="fixed pointer-events-none z-50 rounded-2xl px-3 py-2 bg-sky-200 border border-indigo-500 shadow-lg text-black dark:bg-sky-600 dark:text-white opacity-80"
        :style="{
          top: ghostNote.y + 'px',
          left: ghostNote.x + 'px',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          width: ghostNote.width + 'px',
          height: ghostNote.height + 'px',
          scale: '1.2',
        }"
      >
        {{ ghostNote.noteContent }}
      </div>

      <div
        v-for="(note, index) in scaleToDisplay"
        :key="index"
        ref="noteElements"
        :draggable="dragNotesEnabled"
        @dragend="handleDragOrTouchEnd"
        @touchstart="handleTouchStart($event, note.name)"
        @touchend="handleDragOrTouchEnd"
        @click="playNote(index, 0)"
        :id="index.toString()"
        class="bg-sky-200 border border-indigo-500 shadow rounded-2xl size-full flex items-center justify-center cursor-pointer dark:bg-sky-600 dark:text-white"
        :class="{
          'relative bottom-4 w-1/2 h-5/6 m-auto z-50':
            currentSettings.gridType === 'Guitar tab',
        }"
        :style="{
          gridRowStart:
            currentSettings.gridType !== 'Guitar tab'
              ? gridRows - scaleConfig.selectedPattern.pattern[note.position]
              : note.guitarPositions[note.currentGtrPositionIndex]['string'],
          gridColumnStart: index + 1,
        }"
      >
        <span class="select-none" draggable="false"
          >{{
            currentSettings.gridType !== "Guitar tab"
              ? getNoteName(note.name)
              : note.guitarPositions[note.currentGtrPositionIndex]["fret"]
          }}
        </span>
      </div>
      <canvas
        v-if="currentSettings.gridType === 'Piano roll'"
        ref="pitchCanvas"
        class="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
      >
      </canvas>
    </div>
    <button
      v-if="currentSettings.gridType == 'Guitar tab'"
      :disabled="scaleConfig.noteOrder == null ? false : true"
      class="w-fit h-9 flex items-center justify-center inverted-btn rounded-full"
      @click="findAlternateFretPositions"
    >
      Find Alt. Frets
    </button>
    <Teleport defer to="#pitch-tracking-template">
      <div class="w-full flex">
        <div class="flex w-full items-center justify-between">
          <div class="flex gap-2">
            <button
              :disabled="!isTracking && pitchData.length > 0"
              class="flex items-center gap-2 dark:shadow-sm dark:shadow-indigo-200"
              @click="togglePitchTracking"
            >
              <div
                class="bg-red-500 size-4 rounded-full"
                :class="{
                  'animate-[radar_1s_ease-in-out_infinite]': isTracking,
                }"
              ></div>
              {{ (isTracking ? "Stop " : "Start ") + " Tracking" }}
            </button>
            <button
              class="inverted-btn"
              :disabled="!isTracking && pitchData.length === 0"
              @click="clearPitchData"
            >
              <FontAwesomeIcon :icon="faRotateRight" size="lg" />
            </button>
            <button @click="showInfoModal = true" class="inverted-btn">
              Help
              <FontAwesomeIcon
                :icon="faQuestionCircle"
                class="ps-1 dark:text-white"
                size="lg"
              />
            </button>
          </div>
          <div class="flex items-center gap-2">
            <router-link
              :to="{ name: 'Settings', query: { section: 'pitch-tracking' } }"
            >
              <FontAwesomeIcon
                :icon="faCog"
                size="lg"
                class="text-black dark:text-white"
              />
            </router-link>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  faCog,
  faQuestionCircle,
  faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import DragSelect, { DSInputElement } from "dragselect";
import {
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  ref,
  watch
} from "vue";
import {
  computedLoopGap,
  computedMaxCents,
  currentSettings,
  isLoadingAudio,
  playBackOptions,
  scaleConfig,
  scaleToDisplay,
  tempo,
  validGtrPatternsForCurrentScale,
} from "../GlobalState";
import { notes } from "../NotesAndScales";
import PitchAccuracyModal from "../components/PitchAccuracyModal.vue";
import { usePitchTracker } from "../composables/usePitchTracker";
import useReorderNotes from "../composables/useReorderNotes";
import { Note } from "../types";
import PitchTrackingInfoModal from "./PitchTrackingInfoModal.vue";

const props = defineProps<{
  dragNotesEnabled: boolean;
}>();

const draggedNoteId = ref<string | null>(null);
const ghostNote = ref<{
  noteContent: string;
  x: number;
  y: number;
  width: number;
  height: number;
} | null>(null);

function handleTouchStart(event: TouchEvent, noteContent: string) {
  if (!props.dragNotesEnabled) return;
  const touch = event.touches[0];
  let target = event.target as HTMLElement;
  if (target.tagName === "SPAN") {
    // If the target is a span, get its parent element
    const parent = target.parentElement;
    if (parent) {
      target = parent;
    }
  }
  const rect = target.getBoundingClientRect();
  ghostNote.value = {
    noteContent,
    x: touch.clientX,
    y: touch.clientY,
    width: rect.width,
    height: rect.height,
  };
  if (target?.id) {
    draggedNoteId.value = target.id;
  }
  window.addEventListener("touchmove", handleTouchMove, { passive: false });
  window.addEventListener("touchend", handleDragOrTouchEnd);
}

function handleTouchMove(event: TouchEvent) {
  if (!ghostNote.value) return;
  const touch = event.touches[0];
  ghostNote.value.x = touch.clientX;
  ghostNote.value.y = touch.clientY;

  event.preventDefault(); // prevents unwanted scrolling
}

function handleDragOrTouchEnd(event: DragEvent | TouchEvent) {
  let clientX = 0;
  let clientY = 0;
  let targetId = "";

  if (event instanceof DragEvent) {
    clientX = event.clientX;
    clientY = event.clientY;
    targetId = (event.target as HTMLElement)?.id ?? "";
  } else if (event instanceof TouchEvent) {
    const touch = event.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
    targetId = draggedNoteId.value ?? ""; // Use stored ID
  } else {
    return;
  }

  if (!targetId) return;

  const closestNote = scaleToDisplay.value.reduce(
    (closest, note, index) => {
      const noteElement = document.getElementById(index.toString());
      if (!noteElement) return closest;

      const rect = noteElement.getBoundingClientRect();
      const distance = Math.sqrt(
        Math.pow(clientX - (rect.left + rect.width / 2), 2) +
          Math.pow(clientY - (rect.top + rect.height / 2), 2)
      );

      if (distance < closest.distance) {
        return { note, element: noteElement, distance };
      }
      return closest;
    },
    {
      note: null as Note | null,
      element: null as HTMLElement | null,
      distance: Infinity,
    }
  );

  if (closestNote.element) {
    const targetIndex = parseInt(targetId);
    const closestIndex = parseInt(closestNote.element.id);

    const order = scaleConfig.noteOrder
      ? [...scaleConfig.noteOrder]
      : scaleToDisplay.value.map((note) => note.position);

    [order[targetIndex], order[closestIndex]] = [
      order[closestIndex],
      order[targetIndex],
    ];

    scaleConfig.noteOrder = order;
  }

  draggedNoteId.value = null;
  ghostNote.value = null;
  window.removeEventListener("touchmove", handleTouchMove);
  window.removeEventListener("touchend", handleDragOrTouchEnd);
}

const audioContext = new window.AudioContext();
const { pitchData, startTracking, stopTracking, isTracking } =
  usePitchTracker(audioContext);
const { shuffle } = useReorderNotes();

// const props = defineProps<{
//   workoutMode: boolean;
// }>();

const gridRows = computed(() => {
  return currentSettings.value.gridType !== "Guitar tab" ? 13 : 6;
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
const loadedAudio = ref<{ name: string; audio: AudioBuffer }[]>([]);

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

const setBuffers = () => {
  isLoadingAudio.value = true;
  audioBuffers.value = scaleToDisplay.value.map((note) => {
    const loaded = loadedAudio.value.find((a) => a.name === note.name);
    return loaded ? loaded.audio : null;
  }) as AudioBuffer[];
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
const showPitchModal = ref(false);
const pitchStats = ref({ averageDeviation: 0, inTunePercentage: 0 });

function togglePitchTracking() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  if (startTime.value === null) {
    startTrackingWithAnchor();
  } else {
    stopTracking();
    startTime.value = null;

    mapPitchDataToStats();
  }
}

function mapPitchDataToStats() {
  const maxCents: number = computedMaxCents.value;

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

  const noteCoverage = (perNote.length / scaleToDisplay.value.length) * 100;

  const finalInTuneScore = Math.round(
    (weightedAccuracy * 0.7 + (noteCoverage / 100) * 0.3) * 100
  );

  // Use this for a simple visual modal now
  pitchStats.value = {
    averageDeviation: Math.round((1 - weightedAccuracy) * maxCents),
    inTunePercentage: finalInTuneScore,
  };

  showPitchModal.value = true;
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
    currentSettings.value.gridType !== "Piano roll"
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
  ctx.lineWidth = 1.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  let prevX = 0;
  let increment = 0;
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
    // if x hasn't changed, we want to create a vibrato effect by drawing a small sine wave
    if (x === prevX) {
      // create a sine wave effect
      increment++;
      if (increment >= colWidth / 3) {
        increment = -1;
      }
      const vibratoX = prevX + increment;
      if (increment >= 0) ctx.lineTo(vibratoX, y);
      continue;
    }
    prevX = x;

    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

watch(
  () => [pitchData.value, isTracking.value],
  () => {
    drawPitchCurve();
    if (
      !isTracking.value &&
      pitchData.value.length > 0 &&
      currentSettings.value.autoStopPitchTracking
    ) {
      stopTracking();
      mapPitchDataToStats();
      startTime.value = null;
    }
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
  () => [
    scaleToDisplay.value,
    currentSettings.value.gridType,
    loadedAudio.value,
  ],
  () => {
    setBuffers();
    ds.value?.clearSelection();
    nextTick(() => {
      if (!noteElements.value || noteElements.value.length === 0) return;
      cellWidth.value =
        currentSettings.value.gridType !== "Guitar tab"
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
        setTimeout(
          () => handleAutoActions(),
          computedLoopGap.value * animationInterval.value * 1000
        );
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
        setTimeout(
          () => handleAutoActions(),
          computedLoopGap.value * animationInterval.value * 1000
        );
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

function handleAutoActions() {
  if (currentSettings.value.autoShuffle) {
    scaleConfig.noteOrder = shuffle(scaleToDisplay.value);
  }
  if (currentSettings.value.autoIncrementPitch) {
    scaleConfig.selectedNote =
      notes[
        (notes.findIndex((n) => n.name === scaleConfig.selectedNote) + 1) %
          notes.length
      ].name;
  }
}

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

onBeforeMount(async () => {
  //load all audio
  const entries = await Promise.all(
    notes.map(async (note) => {
      const buffer = await loadAudioBuffer(note.audioSrc);
      return { name: note.name, audio: buffer };
    })
  );

  loadedAudio.value = entries;
  window.addEventListener("visibilitychange", setBuffers);
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
  return;
  // let direction = 1;

  // if (interval) {
  //   clearInterval(interval);
  // }
  // workoutInProgress.value = !workoutInProgress.value;

  // if (workoutInProgress.value) {
  //   setTimeout(() => {
  //     toggleAudio();
  //   }, 100);

  //   // while selected note is not end note, change note after each scale repitition
  //   interval = setInterval(() => {
  //     // selectedNote index
  //     const selectedNoteIndex = notes.findIndex(
  //       (note) => note.name === scaleConfig.selectedNote
  //     );
  //     // if selectedNote is not endNote, increment selectedNote
  //     if (
  //       scaleConfig.selectedNote !== workoutConfig.endNote &&
  //       direction === 1
  //     ) {
  //       // change note to current selected note index + 1
  //       scaleConfig.selectedNote = notes[selectedNoteIndex + direction].name;
  //       // change direction if end note reached
  //       if (scaleConfig.selectedNote === workoutConfig.endNote) {
  //         direction = -1;
  //       }
  //       //toggle audio
  //       setTimeout(() => {
  //         toggleAudio();
  //       }, 100);
  //     } else if (
  //       scaleConfig.selectedNote !== workoutConfig.startNote &&
  //       workoutConfig.roundTrip
  //     ) {
  //       // if selectedNote is not startNote, decrement selectedNote
  //       scaleConfig.selectedNote = notes[selectedNoteIndex + direction].name;
  //       //toggle audio
  //       setTimeout(() => {
  //         toggleAudio();
  //       }, 100);
  //     } else {
  //       // if selectedNote is endNote and no multiple scales, workout is complete
  //       if (workoutConfig.scales.length === 1 && interval) {
  //         clearInterval(interval);
  //         workoutInProgress.value = false;
  //         // reset to start note after workout is complete
  //         setTimeout(() => {
  //           scaleConfig.selectedNote = workoutConfig.startNote;
  //         }, scaleDuration.value);
  //         return;
  //       }
  //       if (workoutConfig.scales.length > 1) {
  //         const currentScaleIndex = workoutConfig.scales.indexOf(
  //           scaleConfig.selectedScale
  //         );
  //         if (currentScaleIndex + 1 < workoutConfig.scales.length) {
  //           //@ts-ignore
  //           scaleConfig.selectedScale =
  //             workoutConfig.scales[currentScaleIndex + 1];

  //           workoutInProgress.value = false;
  //           toggleWorkout();
  //         } else {
  //           workoutInProgress.value = false;
  //           clearInterval(interval);
  //           //@ts-ignore
  //           scaleConfig.selectedScale = workoutConfig.scales[0];
  //         }
  //       } else {
  //         clearInterval(interval);
  //         workoutInProgress.value = false;
  //         // reset to start note after workout is complete
  //         setTimeout(() => {
  //           scaleConfig.selectedNote = workoutConfig.startNote;
  //         }, scaleDuration.value);
  //       }
  //     }
  //   }, scaleDuration.value);
  // } else {
  //   clearInterval(interval);
  //   //disable button to give time for timeouts to clear
  //   isLoadingAudio.value = true;
  //   setTimeout(() => {
  //     isLoadingAudio.value = false;
  //   }, 500);
  //   //toggle audio
  //   toggleAudio();
  // }
}

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener("visibilitychange", setBuffers);
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

.dark .piano-roll {
  background: repeating-linear-gradient(
    180deg,
    #1a202c,
    #1a202c 1.8rem,
    #2d3748 1.8rem,
    #2d3748 3.6rem
  );
}

.dark .grid-pattern {
  background: linear-gradient(90deg, rgb(17 24 39), 1px, transparent 1px);
}

html.dark > .piano-roll {
  background: repeating-linear-gradient(
    180deg,
    #1a202c,
    #1a202c 1.8rem,
    #2d3748 1.8rem,
    #2d3748 3.6rem
  );
}

html.dark > .grid-pattern {
  background: linear-gradient(90deg, rgb(17 24 39), 1px, transparent 1px);
}
</style>
