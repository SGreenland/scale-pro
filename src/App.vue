<script setup lang="ts">
import ScaleConfig from "./components/ScaleConfig.vue";
import Scale from "./components/Scale.vue";
import TempoSelect from "./components/TempoSelect.vue";
import AudioControls from "./components/AudioControls.vue";

import { watch, ref } from "vue";

import { Note } from "./types";

const scaleConfig = ref({
  scaleToDisplay: [] as Note[],
  originalOrder: [] as string[],
});
const scaleComponent = ref({
  // @ts-ignore
  toggleAudio: (isForwardsAndBackwards: boolean, shouldLoop: boolean) => {},
  audioIsPlaying: false,
});
const notesAreLoading = ref(false);
const tempo = ref("120");

function handleToggleAudio(isForwardsAndBackwards: boolean, shouldLoop: boolean) {
  scaleComponent.value?.toggleAudio(isForwardsAndBackwards, shouldLoop);
}

// Preload audio files
const preloadAudio = () => {
  notesAreLoading.value = true;
  const promises = scaleConfig.value.scaleToDisplay.map((note) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(note.audioSrc);
      audio.preload = "auto";
      audio.oncanplaythrough = () => resolve();
      audio.load();
    });
  });

  Promise.all(promises).then(() => {
    notesAreLoading.value = false;
  });
};

// load notes for scale when any config changes
watch(
  [tempo, () => scaleConfig.value.scaleToDisplay],
  () => {
    preloadAudio();
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="grid gap-3 w-full">
    <scale-config ref="scaleConfig" />
    <tempo-select
      class="w-60 m-auto"
      v-model="tempo"
      :labels="['Tempo', `${tempo}bpm`]"
      :disabled="scaleComponent.audioIsPlaying"
    />
    <audio-controls
      :notesAreLoading="notesAreLoading"
      :audioIsPlaying="scaleComponent.audioIsPlaying"
      @toggleAudio="handleToggleAudio"
    ></audio-controls>
    <scale
      ref="scaleComponent"
      :scaleToDisplay="scaleConfig.scaleToDisplay"
      :originalOrder="scaleConfig.originalOrder"
      :tempo="tempo"
    />
  </div>
</template>
