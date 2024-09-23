<script setup lang="ts">
import ScaleConfig from "./components/ScaleConfig.vue";
import Scale from "./components/Scale.vue";
import TempoSelect from "./components/TempoSelect.vue";
import AudioControls from "./components/AudioControls.vue";
import SwipePitch from "./components/SwipePitch.vue";
import Tabs from "./components/reuseable/Tabs.vue";
import { workoutConfig } from "./GlobalState";
import WorkoutConfig from "./components/WorkoutConfig.vue";

import { ref } from "vue";
import { Note, Scales } from "./types";
import { notes } from "./NotesAndScales";
import DropdownButton from "./components/reuseable/DropdownButton.vue";

const scaleConfig = ref({
  scaleToDisplay: [] as Note[],
  selectedNote: "C4" as Note["name"],
  selectedScaleType: "Major" as keyof Scales,
});
const scaleComponent = ref({
  // @ts-ignore
  toggleAudio: () => {},
  audioIsPlaying: false,
});
const tabsComponent = ref({
  currentTab: "practice",
});
const tempo = ref("120");
const workoutInProgress = ref(false);

function handlePitchChange(note: Note["name"]) {
  scaleConfig.value.selectedNote = note;
}

function toggleWorkout() {
  const scaleDuration =
    (scaleConfig.value.scaleToDisplay.length * 2 * 60100) / +tempo.value;
  let direction = 1;
  let interval = 0;

  workoutInProgress.value = !workoutInProgress.value;

  if (workoutInProgress.value) {
    console.log("workout started");
    setTimeout(() => {
      scaleComponent.value.toggleAudio();
    }, 100);

    // while selected note is not end note, change note after each scale repitition
    interval = setInterval(() => {
      if (!workoutInProgress.value) {
        clearInterval(interval);
        return;
      }
      // selectedNote index
      const selectedNoteIndex = notes.findIndex(
        (note) => note.name === scaleConfig.value.selectedNote
      );
      // if selectedNote is not endNote, increment selectedNote
      if (
        scaleConfig.value.selectedNote !== workoutConfig.endNote &&
        direction === 1
      ) {
        // change note to current selected note index + 1
        scaleConfig.value.selectedNote =
          notes[selectedNoteIndex + direction].name;
        // change direction if end note reached
        if (scaleConfig.value.selectedNote === workoutConfig.endNote) {
          direction = -1;
        }
        //toggle audio
        setTimeout(() => {
          scaleComponent.value.toggleAudio();
        }, 100);
      } else if (
        scaleConfig.value.selectedNote !== workoutConfig.startNote &&
        workoutConfig.roundTrip
      ) {
        // if selectedNote is not startNote, decrement selectedNote
        scaleConfig.value.selectedNote =
          notes[selectedNoteIndex + direction].name;
        //toggle audio
        setTimeout(() => {
          scaleComponent.value.toggleAudio();
        }, 100);
      } else {
        // if selectedNote is endNote, workout is complete
        clearInterval(interval);
        workoutInProgress.value = false;
        // reset to start note after workout is complete
        setTimeout(() => {
          scaleConfig.value.selectedNote = workoutConfig.startNote;
        }, scaleDuration);
      }
    }, scaleDuration);
  }
  else {
    console.log("workout stopped");
    clearInterval(interval);
    //toggle audio
    scaleComponent.value.toggleAudio();
  }
}
</script>

<template>
  <div class="grid gap-3 w-full">
    <tabs
      ref="tabsComponent"
      class="lg:w-2/3 w-full m-auto"
      :tabs="['practice', 'workout']"
    >
      <template #practice> </template>
      <template #workout>
        <!--dropdown button to configure options-->
        <div class="grid m-auto grid-cols-2 gap-4">
          <div class="font-medium">1. Configure Options</div>
          <DropdownButton buttonText="Configure">
            <WorkoutConfig />
          </DropdownButton>
          <div class="font-medium">2. Start your workout!</div>
          <button @click="toggleWorkout">
            {{ workoutInProgress ? "Stop" : "Run" }}
          </button>
        </div>
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
      :scaleToDisplay="scaleConfig.scaleToDisplay"
      :scaleType="scaleConfig.selectedScaleType"
      :tempo="tempo"
    />
    <div v-show="tabsComponent.currentTab === 'practice'">
      <tempo-select
        class="w-60 m-auto"
        v-model="tempo"
        :labels="['Tempo', `${tempo}bpm`]"
      />
      <audio-controls
        :audioIsPlaying="scaleComponent?.audioIsPlaying || false"
        @toggleAudio="scaleComponent?.toggleAudio"
      ></audio-controls>
    </div>
    <!-- <swipe-pitch :root-note="scaleConfig.selectedNote" @pitch-change="handlePitchChange" /> -->
  </div>
</template>
