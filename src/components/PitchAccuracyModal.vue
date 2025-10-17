<template>
  <modal-wrapper>
    <div v-if="!dataSaved">
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
        <div v-if="unlockedAlertText" class="mb-4 p-4 bg-green-100 text-green-800 rounded">
          {{ unlockedAlertText }}
        </div>
        <div v-if="currentLoggedInUser?.hasPremiumAccess" class="flex gap-2 justify-end border-t pt-4">
        <button class="inverted-btn">Screenshot</button>
        <submit-button width-class="w-20":is-submitting="isSaving" @click="handleSave">Save</submit-button>
      </div>
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
    </div>
    <div v-else class="text-center p-6">
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        🎉 Data Saved!
      </h2>
      <p class="text-lg text-gray-800 dark:text-gray-200 mb-4">
        Your pitch accuracy data has been successfully saved.
      </p>
      <router-link to="/my-pitch-data">View my pitch data</router-link>
      <!-- <button
        @click="$emit('close')"
        class="px-4 py-2 inverted-btn rounded-full"
      >
        Close
      </button> -->
    </div>

  </modal-wrapper>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import ModalWrapper from "./reuseable/ModalWrapper.vue";
import axios from "axios";
import { currentSettings, scaleConfig, currentLoggedInUser, availablePatterns, userUnlockedPatternIds} from "../GlobalState";
import SubmitButton from "./reuseable/SubmitButton.vue";
import { NotePattern } from "packages/shared-types/dist";
import { response } from "express";
const props = defineProps<{
  averageDeviation: number;
  inTunePercentage: number;
  isNoData: boolean;
}>();

const isSaving = ref(false);
const dataSaved = ref(false);
const unlockedAlertText = ref("");

const feedbackMessage = computed(() => {
  const percent = props.inTunePercentage;
  if (percent >= 90) return "🎉 Perfect pitch! Amazing work.";
  if (percent >= 75) return "👏 Great job! Keep it up.";
  if (percent >= 50) return "👍 Not bad, you're getting there.";
  if (percent >= 25) return "💪 Decent effort! Practice will help.";
  return "🎯 Keep practicing — you're on the right track!";
});

type ChallengePattern = {
  patternName: string;
  inTuneThreshold: number;
  patternToUnlock: string;
}

const challengePatterns: ChallengePattern[] = [
  { patternName: 'Natural Minor', inTuneThreshold: 70, patternToUnlock:  'Diminished' },
  { patternName: 'Harmonic Minor', inTuneThreshold: 70, patternToUnlock:  'Locrian' },
  { patternName: 'Minor Pentatonic', inTuneThreshold: 70, patternToUnlock:  'Blues Scale' },
  { patternName: 'Major Scale', inTuneThreshold: 75, patternToUnlock:  'Major Pentatonic' },
  { patternName: 'Major Pentatonic', inTuneThreshold: 75, patternToUnlock:  'Mixolydian' },
  { patternName: 'Diminished', inTuneThreshold: 80, patternToUnlock:  'Whole Tone' },
  { patternName: 'Perfect 5th', inTuneThreshold: 80, patternToUnlock:  'Diminished 5th' },
  { patternName: 'Perfect 4th', inTuneThreshold: 80, patternToUnlock:  'Augmented 5th' },
];

onMounted(() => {
  if (currentLoggedInUser.value?.hasPremiumAccess) {
    const currentPattern = scaleConfig.selectedPattern as NotePattern;
    const challenge = challengePatterns.find(c => c.patternName === currentPattern.name);
    if (challenge && !props.isNoData &&  props.inTunePercentage >= challenge.inTuneThreshold) {
      axios.post('/api/note-patterns/unlock', {
        patternId: availablePatterns.value.find(p => p.name === challenge.patternToUnlock)?.id,
      })
      .then((response) => {
        unlockedAlertText.value = `🎉 Congrats! You've unlocked the ${challenge.patternToUnlock} by achieving ${challenge.inTuneThreshold}% in tune on the ${challenge.patternName}!`;
        //update user's unlocked patterns in global state
        if (response.data.unlockedPatterns){
           userUnlockedPatternIds.value = response.data.unlockedPatterns;
        }
      })
      .catch((error) => {
        console.error("Error unlocking pattern:", error);
      });
    }
  }
})

const handleSave = () => {
  if (isSaving.value) return; // Prevent multiple submissions
  isSaving.value = true;
  axios.post("/api/pitch-data", {
    scale: scaleConfig.selectedNote + ' ' + scaleConfig.selectedPattern.name,
    averageDeviation: props.averageDeviation,
    percentageInTune: props.inTunePercentage,
    toleranceLevel: currentSettings.value.pitchToleranceLevel,
  })
    .then(() => {
      dataSaved.value = true;
    })
    .catch((error) => {
      console.error("Error saving pitch data:", error);
      alert("Failed to save pitch data. Please try again.");
    })
    .finally(() => {
      isSaving.value = false;
    });
};
</script>
