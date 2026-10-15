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
            <button @click="selectedPath = notSurePathOptions[0]" class="unset bg-sky-100" :class="{'shadow-xl scale-[1.02] bg-sky-300': selectedPath === 'default starting note'}">I'll just use the default starting note.</button>
            <button @click="selectedPath = notSurePathOptions[1]" class="unset bg-sky-100 relative" :class="{'shadow-xl scale-[1.02] bg-sky-300': selectedPath === 'find out by singing'}">Sing a comfortable note and find out?</button>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-2 justify-center" v-else>
      <select v-model="voiceType">
        <option value="null" disabled>Select your instrument</option>
        <option
          v-for="option in musicalInstrumentOptions"
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
      <span class="bg-yellow text-black text-sm rounded-xl p-4"><b>Not listed?</b> <i> - Just pick the instrument closest to yours and you might have to do a little manual adjusting later on.</i></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MusicalInstrument, VoiceType } from "src/types";
import useSetupWizard from "../../composables/useSetupWizard";
const { voiceOrInstrument, voiceType } = useSetupWizard();

const notSurePathOptions = ["default starting note", "find out by singing"];

const selectedPath = ref(notSurePathOptions[1]);

const voiceTypeOptions: VoiceType[] = [
  "Soprano",
  "Mezzo-Soprano",
  "Alto",
  "Tenor",
  "Baritone",
  "Bass",
  "Not sure",
];
const musicalInstrumentOptions: MusicalInstrument[] = [
  "Piano",
  "Violin",
  "Viola",
  "Cello",
  "Flute",
  "Clarinet",
  "Saxophone",
  "Trumpet",
  "Trombone",
  "Guitar"
];
</script>

<style scoped></style>
