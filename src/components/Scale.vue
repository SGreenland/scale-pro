<template>
  <div
    :class="`grid max-sm:text-xs md:gap-2 gap-1 lg:w-2/3 w-full m-auto`"
    :style="{
      gridTemplateColumns: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
    }"
  >
    <div
      v-for="(note, index) in scaleToDisplay"
      :key="index"
      ref="notes"
      @click="!audioIsPlaying && playNote(index, 0)"
      class="p-2 bg-blue-100 rounded-lg w-full h-full flex items-center justify-center cursor-pointer dark:bg-blue-800 dark:text-white"
      :style="{
        gridRowStart: scaleToDisplay.length - note.interval + 1,
        gridColumnStart: index + 1,
      }"
    >
      <span
        >{{ getNoteName(note.name)
        }}<small>({{ note.interval }})</small></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { Note } from "../types";

function getNoteName(note: string) {
  if (note.includes("sharp")) {
    return note.replace("sharp", "#");
  }
  return note;
}

const props = defineProps<{
  scaleToDisplay: Note[];
  tempo: string;
}>();

const notes = ref<HTMLDivElement[]>([]);
const audioIsPlaying = ref(false);
const audioBuffers = ref<AudioBuffer[]>([]);
const audioContext = new window.AudioContext();
const isContextResumed = ref(false);

const animationInterval = computed(() => 60000 / +props.tempo / 1000); // Convert to seconds

// const lastTime = ref(0);
const noteIndex = ref(0);
const direction = ref(1);
let animationFrameId: number | null = null;

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
};

const resumeAudioContext = async () => {
  if (isContextResumed.value) {
    return;
  }
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
  isContextResumed.value = true;
};

const playNote = (index: number, time: number) => {
  const audioBuffer = audioBuffers.value[index];
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start(time);

  const noteElement = notes.value[index];
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

watch(() => props.scaleToDisplay, preloadAudio, {
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
      currentNoteIndex === props.scaleToDisplay.length
    ) {
      if (isForwardsAndBackwards.value) {
        currentDirection = -1;
        currentNoteIndex -= 2; // step back to the previous note
      } else if (shouldLoop.value) {
        // pause for two beats before looping - maybe make this a setting
        currentTime += animationInterval.value * 2;
        currentNoteIndex = 0;
      } else {
        audioIsPlaying.value = false;
        break;
      }
    } else if (currentDirection === -1 && currentNoteIndex === -1) {
      if (isForwardsAndBackwards.value && shouldLoop.value) {
        // pause for one beat before looping
        currentTime += animationInterval.value;
        currentDirection = 1;
        currentNoteIndex = 0; // step forward to the next note
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

const isForwardsAndBackwards = ref(false);
const shouldLoop = ref(false);

const toggleAudio = async (forwardsAndBackwards: boolean, loop: boolean) => {
  isForwardsAndBackwards.value = forwardsAndBackwards;
  shouldLoop.value = loop;
  if (!audioIsPlaying.value) {
    await resumeAudioContext();
    audioIsPlaying.value = true;
    noteIndex.value = 0;
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
  window.addEventListener("click", resumeAudioContext, { once: true });
  window.addEventListener("mousemove", resumeAudioContext, { once: true });
});

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
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
