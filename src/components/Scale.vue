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
import { ref, computed, watch } from "vue";
import type { Note } from "../types";

const notesAreReady = ref(false);

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
const audioElements = ref<HTMLAudioElement[]>();

const animationInterval = computed(() => 60000 / +props.tempo);

const playNote = (index: number) => {
  const noteElement = notes.value[index];
  if (noteElement) {
    noteElement.style.animation = `bounce ${animationInterval.value}ms ease-out`;
    setTimeout(() => {
      noteElement.style.animation = "";
    }, animationInterval.value);
  }

  const audio = audioElements.value![index];
  audio.currentTime = 0;
  audio.play();
};

const preloadAudio = () => {
  const promises = props.scaleToDisplay.map(note => {
    return new Promise<HTMLAudioElement>((resolve) => {
      const audio = new Audio(note.audioSrc);
      audio.preload = "auto";
      audio.oncanplaythrough = () => resolve(audio);
      audio.load();
    });
  });

  Promise.all(promises).then((loadedAudios) => {
    audioElements.value = loadedAudios;
    notesAreReady.value = true;
  });
};

watch(() => props.scaleToDisplay, preloadAudio, { deep: true, immediate: true });

let timeoutIds: number[] = [];

const toggleAudio = (isForwardsAndBackwards: boolean, shouldLoop: boolean) => {
  if (!audioIsPlaying.value) {
    audioIsPlaying.value = true;
    let currentIndex = 0;

    const playSequence = () => {
      if (currentIndex < props.scaleToDisplay.length) {
        playNote(currentIndex);
        currentIndex++;
      } else if (isForwardsAndBackwards && currentIndex < props.scaleToDisplay.length * 2 - 1) {
        const reversedIndex = currentIndex - props.scaleToDisplay.length;
        playNote(props.scaleToDisplay.length - 2 - reversedIndex);
        currentIndex++;
      } else if (shouldLoop) {
        currentIndex = 0;
      } else {
        audioIsPlaying.value = false;
        return;
      }

      timeoutIds.push(setTimeout(playSequence, animationInterval.value));
    };

    playSequence();
  } else {
    timeoutIds.forEach(clearTimeout);
    audioIsPlaying.value = false;
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
