<script setup lang="ts">
import { tempo } from "./GlobalState";
import AudioControls from "./components/AudioControls.vue";
import Scale from "./components/Scale.vue";
import ScaleConfig from "./components/ScaleConfig.vue";
import TempoSelect from "./components/TempoSelect.vue";
import WorkoutConfig from "./components/WorkoutConfig.vue";
import Tabs from "./components/reuseable/Tabs.vue";

import { ref, watch } from "vue";

// const scaleConfig = ref({
//   scaleToDisplay: [] as Note[],
//   selectedNote: "C4" as Note["name"],
//   selectedScaleType: "Major" as keyof Scales,
// });
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

// function handlePitchChange(note: Note["name"]) {
//   scaleConfig.value.selectedNote = note;
// }

watch(() => tabsComponent.value.currentTab, () => {
    scaleComponent.value.audioIsPlaying = false;
    scaleComponent.value.workoutInProgress = false;
});

</script>

<template>
  <div class="flex flex-col gap-3 w-full">
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
      ref="scaleConfig"
    />
    <scale
      ref="scaleComponent"
      :workoutMode="tabsComponent.currentTab === 'workout'"
    />
    <div>
      <tempo-select
        class="w-60 m-auto"
        v-model="tempo"
        :labels="['Tempo', `${tempo}bpm`]"
      />
      <audio-controls
        :mode="tabsComponent.currentTab"
        :audioIsPlaying="scaleComponent?.audioIsPlaying || false"
        @toggleAudio="scaleComponent?.toggleAudio"
        @toggleWorkout="scaleComponent?.toggleWorkout"
      ></audio-controls>
    </div>
    <!-- <swipe-pitch :root-note="scaleConfig.selectedNote" @pitch-change="handlePitchChange" /> -->
  </div>
</template>
