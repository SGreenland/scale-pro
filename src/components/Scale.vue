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
      @click="!audioIsPlaying && playNote(index)"
      class="p-2 bg-blue-100 rounded-lg w-full h-full flex items-center justify-center cursor-pointer dark:bg-blue-800 dark:text-white"
      :style="{
        gridRowStart: scaleToDisplay.length - originalOrder.indexOf(note.name),
        gridColumnStart: index + 1,
      }"
    >
      <span>{{ getNoteName(note.name) }}<small>({{ originalOrder.indexOf(note.name) + 1 }})</small></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, } from "vue";
import type { Note } from "../types";
import { Howl } from "howler";

function getNoteName(note: string) {
  if (note.includes("sharp")) {
    return note.replace("sharp", "#");
  }
  return note;
}

const props = defineProps<{
  scaleToDisplay: Note[];
  originalOrder: string[];
  tempo: string;
}>();

const notes = ref<HTMLDivElement[]>([]);
const audioIsPlaying = ref(false);
const audioElements = ref<Howl[]>();

const animationInterval = computed(() => 60000 / +props.tempo);

const lastTime = ref(0);
const noteIndex = ref(0);
const direction = ref(1);
let animationFrameId: number | null = null;

const playNote = (index: number) => {
  const audio = audioElements.value![index];
  console.log(Date.now());
  audio.play();
  const noteElement = notes.value[index];
  if (noteElement) {
    requestAnimationFrame(() => {
      noteElement.style.animation = `bounce ${animationInterval.value}ms ease-out`;
      setTimeout(() => {
        noteElement.style.animation = "";
      }, animationInterval.value - 20);
    });
  }
};

const preloadAudio = () => {
  //howler implementation
  const loadedAudios = props.scaleToDisplay.map(note => {
    return new Howl({
      src: [note.audioSrc],
      preload: true,
      html5: true,
    });
  });

  audioElements.value = loadedAudios;
};

watch(() => props.scaleToDisplay, preloadAudio, { deep: true, immediate: true });

const animate = (timestamp: number) => {
  if (!lastTime.value) lastTime.value = timestamp;
  const elapsed = timestamp - lastTime.value;

  if (elapsed >= animationInterval.value) {
    playNote(noteIndex.value);
    if (direction.value === 1 && noteIndex.value === props.scaleToDisplay.length - 1) {
      if (isForwardsAndBackwards.value) {
        direction.value = -1;
      } else if (shouldLoop.value) {
        noteIndex.value = -1;
      }
    } else if (direction.value === -1 && noteIndex.value === 0) {
      if (isForwardsAndBackwards.value) {
        direction.value = 1;
      } else if (shouldLoop.value) {
        noteIndex.value = props.scaleToDisplay.length;
      }
    }
    noteIndex.value += direction.value;
    lastTime.value = timestamp;
  }

  if (audioIsPlaying.value) {
    animationFrameId = requestAnimationFrame(animate);
  }
};

const isForwardsAndBackwards = ref(false);
const shouldLoop = ref(false);

const toggleAudio = (forwardsAndBackwards: boolean, loop: boolean) => {
  isForwardsAndBackwards.value = forwardsAndBackwards;
  shouldLoop.value = loop;
  if (!audioIsPlaying.value) {
    audioIsPlaying.value = true;
    lastTime.value = 0;
    noteIndex.value = 0;
    direction.value = 1;
    animationFrameId = requestAnimationFrame(animate);
  } else {
    audioIsPlaying.value = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }
};

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
