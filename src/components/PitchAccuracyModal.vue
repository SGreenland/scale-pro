<template>
  <modal-wrapper>
    <div v-if="!isNoData">
      <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        🎤 Pitch Accuracy
      </h2>
      <p class="text-lg text-gray-800 dark:text-gray-200 mb-2">
        🎯 Avg Deviation: <strong>{{ averageDeviation.toFixed(1) }}¢</strong>
      </p>
      <p class="text-lg text-gray-800 dark:text-gray-200 mb-4">
        ✅ In Tune: <strong>{{ inTunePercentage.toFixed(1) }}%</strong>
      </p>
      <p class="text-base italic text-gray-600 dark:text-gray-300 mb-6">
        {{ feedbackMessage }}
      </p>
    </div>
    <div v-else class="text-center">
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        No Data Available
      </h2>
      <div class="text-lg text-gray-800 dark:text-gray-200">
        <p class="mb-4">
          It seems there is no pitch data to display at the moment.
        </p>
        <hr />
        <p class="my-4">
          <b>Tip:</b>
          <i>
            Make sure to sing or play a note to generate data - try getting
            closer to your device's microphone or singing/playing a little
            louder!
          </i>
        </p>
      </div>
    </div>
    <!-- <button
        @click="$emit('close')"
        class="px-4 py-2 inverted-btn rounded-full"
      >
        Close
      </button> -->
    <div v-if="hasFullAccess()" class="flex gap-2 justify-end border-t pt-4 mt-4">
      <button class="inverted-btn">Screenshot</button>
      <button @click="handleSave">Save</button>
    </div>
  </modal-wrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import ModalWrapper from "./reuseable/ModalWrapper.vue";
import { hasFullAccess } from "../utils/checkUserAccess";
import axios from "axios";
import { currentSettings, scaleConfig } from "../GlobalState";
const props = defineProps<{
  averageDeviation: number;
  inTunePercentage: number;
  isNoData: boolean;
}>();

const feedbackMessage = computed(() => {
  const percent = props.inTunePercentage;
  if (percent >= 90) return "🎉 Perfect pitch! Amazing work.";
  if (percent >= 75) return "👏 Great job! Keep it up.";
  if (percent >= 50) return "👍 Not bad, you're getting there.";
  if (percent >= 25) return "💪 Decent effort! Practice will help.";
  return "🎯 Keep practicing — you're on the right track!";
});
const handleSave = () => {
  axios.post("/api/pitch-data", {
    scale: scaleConfig.selectedNote + scaleConfig.selectedScale,
    averageDeviation: props.averageDeviation,
    percentageInTune: props.inTunePercentage,
    toleranceLevel: currentSettings.value.pitchToleranceLevel,
  })
    .then(() => {
      alert("Pitch data saved successfully!");
      // Optionally, emit an event to notify parent component
      // emit('saved');
    })
    .catch((error) => {
      console.error("Error saving pitch data:", error);
      alert("Failed to save pitch data. Please try again.");
    });
};
</script>
