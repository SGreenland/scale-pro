<script setup lang="ts">
import { tempo } from "./GlobalState";
import AudioControls from "./components/AudioControls.vue";
import QuickTranspose from "./components/QuickTranspose.vue";
import Scale from "./components/Scale.vue";
import ScaleConfig from "./components/ScaleConfig.vue";
import TempoSelect from "./components/TempoSelect.vue";
import WorkoutConfig from "./components/WorkoutConfig.vue";
import Tabs from "./components/reuseable/Tabs.vue";

import { ref, watch } from "vue";

const scaleConfigComponent = ref<InstanceType<typeof ScaleConfig> | undefined>(undefined);
const scaleComponent = ref({
  // @ts-ignore
  toggleAudio: () => {},
  toggleWorkout: () => {},
  audioIsPlaying: false,
  workoutInProgress: false,
});
const tabsComponent = ref({
  currentTab: "practice",
});
const tempoSelect = ref<InstanceType<typeof TempoSelect> | null>(null);

// function handlePitchChange(note: Note["name"]) {
//   scaleConfig.value.selectedNote = note;
// }

watch(() => tabsComponent.value.currentTab, () => {
    scaleComponent.value.audioIsPlaying = false;
    scaleComponent.value.workoutInProgress = false;
});

</script>

<template>
  <div class="flex flex-col gap-3 w-full max-sm:text-[0.9rem]">
    <tabs
      ref="tabsComponent"
      class="lg:w-2/3 w-full m-auto flex flex-col gap-3"
      :tabs="['practice', 'workout']"
    >
      <template #practice> </template>
      <template #workout>
          <WorkoutConfig :workout-in-progress="scaleComponent.workoutInProgress" />
      </template>
    </tabs>
    <scale-config
      class="lg:w-2/3 m-auto"
      v-show="tabsComponent.currentTab === 'practice'"
      :workoutMode="tabsComponent.currentTab === 'workout'"
      ref="scaleConfigComponent"
    />
    <scale
      ref="scaleComponent"
      :workoutMode="tabsComponent.currentTab === 'workout'"
    />
    <div class="flex flex-col gap-3">
      <tempo-select
        ref="tempoSelect"
        class="w-60 m-auto"
        v-model="tempo"
        label="Tempo"
        labelSuffix="BPM"
        :min="40"
        :max="300"
      />
      <audio-controls
        :isInvalidTempo="tempoSelect?.isInvalidTempo"
        :mode="tabsComponent.currentTab"
        :audioIsPlaying="scaleComponent?.audioIsPlaying || false"
        @toggleAudio="scaleComponent?.toggleAudio"
        @toggleWorkout="scaleComponent?.toggleWorkout"
      ></audio-controls>
    </div>
    <!-- <swipe-pitch :root-note="scaleConfig.selectedNote" @pitch-change="handlePitchChange" /> -->
  </div>
</template>
