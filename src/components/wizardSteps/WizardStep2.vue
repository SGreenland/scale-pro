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
            <button @click="selectedPath = notSurePathOptions[0]" class="unset bg-sky-100 text-sm" :class="{'shadow-xl scale-[1.02] bg-sky-300': selectedPath === 'default starting note'}">I'll use the default starting note</button>
            <button @click="selectedPath = notSurePathOptions[1]" class="unset bg-sky-100 relative text-sm" :class="{'shadow-xl scale-[1.02] bg-sky-300': selectedPath === 'find out by singing'}">Sing a note to find out</button>
        </div>
      </div>
      <div v-if="selectedPath === notSurePathOptions[1]">
        <span class="text-sm text-gray-500">{{ !finishedListeningMessage ? "Sing a comfortable note to determine your voice type (you may need to enable your microphone). For best results sing clearly and close to your device." : finishedListeningMessage }}</span>
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
import { ref, watch } from "vue";
import { MusicalInstrument, VoiceType } from "src/types";
import useSetupWizard from "../../composables/useSetupWizard";
import { usePitchTracker } from "../../composables/usePitchTracker";
import { vocalRangeNoteMap } from "../../data/wizardData";
import { noteToFrequency } from "../../NotesAndScales";
const { voiceOrInstrument, voiceType, disableNext } = useSetupWizard();
const audioContext = new (window.AudioContext)();
const { startTracking, stopTracking, pitchData } = usePitchTracker(audioContext);

const notSurePathOptions = ["default starting note", "find out by singing"];

const selectedPath = ref("");
const isListening = ref(false);
const finishedListeningMessage = ref("");

function mapPitchToVoiceType(averagePitch: number) {
    for (const [voice, range] of Object.entries(vocalRangeNoteMap)) {
        const [lowNote, highNote] = range.split("-").map(note => noteToFrequency(note));
        if (averagePitch >= lowNote && averagePitch <= highNote) {
            voiceType.value = voice as VoiceType;
            return;
        }
    }
    voiceType.value = "Not sure";
}

watch([voiceType,selectedPath], ([voiceType, selectedPath]) => {
  disableNext.value = !voiceType || voiceType === "Not sure" && selectedPath !== notSurePathOptions[0];
  if (selectedPath === notSurePathOptions[1] && !isListening.value) {
    startTracking();
    isListening.value = true;
  }
}, { immediate: true });

watch(pitchData, (newVal) => {
  if(newVal.length > 30) {
   stopTracking();
   isListening.value = false;
   //map pitch property from array and calculate average
   const averagePitch = pitchData.value.map(p => p.pitch).reduce((a, b) => a + b, 0) / pitchData.value.length;
   mapPitchToVoiceType(averagePitch);
   pitchData.value = []; // reset pitch data after processing
   finishedListeningMessage.value = "OK we have set an appropriate voice type, click next to continue.";

  }
}, { deep: true});

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
