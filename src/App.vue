<script setup lang="ts">
import ScaleConfig from "./components/ScaleConfig.vue";
import Scale from "./components/Scale.vue";
import TempoSelect from "./components/TempoSelect.vue";
import AudioControls from "./components/AudioControls.vue";

import { ref } from "vue";
import { Note, Scales } from "./types";

const scaleConfig = ref({
  scaleToDisplay: [] as Note[],
  originalOrder: [] as string[],
  selectedScaleType: "Major" as keyof Scales,
});
const scaleComponent = ref({
  // @ts-ignore
  toggleAudio: () => {},
  audioIsPlaying: false,
});
const tempo = ref("120");

</script>

<template>
  <div class="grid gap-3 w-full">
    <scale-config ref="scaleConfig" />
    <tempo-select
      class="w-60 m-auto"
      v-model="tempo"
      :labels="['Tempo', `${tempo}bpm`]"
    />
    <audio-controls
      :audioIsPlaying="scaleComponent?.audioIsPlaying || false"
      @toggleAudio="scaleComponent?.toggleAudio"
    ></audio-controls>
    <scale
      ref="scaleComponent"
      :scaleToDisplay="scaleConfig.scaleToDisplay"
      :scaleType="scaleConfig.selectedScaleType"
      :tempo="tempo"
    />
  </div>
</template>
