<template>
  <div>
    <div
      class="flex flex-col gap-2 justify-center"
      v-if="voiceOrInstrument === 'vocalist'"
    >
      <select v-model="voiceType">
        <option value="null" disabled>Select your voice type</option>
        <option
          v-for="option in voiceTypeOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <!--if not sure -->
      <div class="grid gap-2" v-if="voiceType === 'Not sure'">
        Choose an option below:
        <div class="flex gap-2">
            <button class="unset bg-sky-100">I'll just use the default starting note.</button>
            <button class="unset bg-sky-100">Sing a comfortable note and find out?</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VoiceType } from "src/types";
import useSetupWizard from "../../composables/useSetupWizard";
const { voiceOrInstrument, voiceType } = useSetupWizard();

const voiceTypeOptions: VoiceType[] = [
  "Soprano",
  "Mezzo-Soprano",
  "Alto",
  "Tenor",
  "Baritone",
  "Bass",
  "Not sure",
];
</script>

<style scoped></style>
