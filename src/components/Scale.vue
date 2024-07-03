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
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
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

const audioWorker = ref<Worker | null>(null);

onMounted(() => {
  // Use new URL syntax to import the worker
  audioWorker.value = new Worker(new URL('../utils/audioWorker.js', import.meta.url));
  audioWorker.value.onmessage = (event) => {
    const data = event.data;

    if (data.type === 'playNote') {
      playNote(data.index);
    } else if (data.type === 'done') {
      audioIsPlaying.value = false;
    }
  };
});

onBeforeUnmount(() => {
  if (audioWorker.value) {
    audioWorker.value.terminate();
  }
});

const playNote = (index: number) => {
  const audio = audioElements.value![index];
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

// const playNoteDebounced = debounce(playNote, 30);

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

const toggleAudio = (isForwardsAndBackwards: boolean, shouldLoop: boolean) => {
  if (!audioIsPlaying.value) {
    audioIsPlaying.value = true;

    audioWorker.value?.postMessage({
      type: 'start',
      isForwardsAndBackwards,
      shouldLoop,
      scaleLength: props.scaleToDisplay.length,
      animationInterval: animationInterval.value,
    });
  } else {
    audioWorker.value?.postMessage({ type: 'stop' });
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
