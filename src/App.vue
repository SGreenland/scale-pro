<script setup lang="ts">
import ScaleConfig from "./components/ScaleConfig.vue";
import Scale from "./components/Scale.vue";
import TempoSelect from "./components/TempoSelect.vue";
import AudioControls from "./components/AudioControls.vue";

import { ref } from "vue";
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

function handleToggleAudio(
  isForwardsAndBackwards: boolean,
  shouldLoop: boolean
) {
  scaleComponent.value?.toggleAudio(isForwardsAndBackwards, shouldLoop);
}
</script>

<template>
  <div class="grid gap-3 w-full">
    <scale-config ref="scaleConfig" />
    <tempo-select
      class="w-60 m-auto"
      v-model="tempo"
      :labels="['Tempo', `${tempo}bpm`]"
      :disabled="scaleComponent?.audioIsPlaying"
    />
    <audio-controls
      :notesAreLoading="notesAreLoading"
      :audioIsPlaying="scaleComponent?.audioIsPlaying || false"
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
