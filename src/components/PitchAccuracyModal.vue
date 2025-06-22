<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
  >
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md"
    >
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
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          No Data Available
        </h2>
        <div class="text-lg text-gray-800 dark:text-gray-200 mb-4">
          <p>It seems there is no pitch data to display at the moment.</p>
          <hr>
          <small
            ><b>TIP:</b> Make sure to sing or play a note to generate data - try
            getting closer to your device's microphone or singing/playing a
            little louder!</small
          >
        </div>
      </div>
      <button
        @click="$emit('close')"
        class="px-4 py-2 inverted-btn rounded-full"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
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
</script>
