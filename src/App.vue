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
import Dropdown from "./components/reuseable/Dropdown.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const scaleConfig = ref({
  scaleToDisplay: [] as Note[],
  selectedNote: ("C4" as Note["name"]),
  selectedScaleType: ("Major" as keyof Scales),
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
  let interval: number;
  let direction = 1;
  const scaleDuration =
    (scaleConfig.value.scaleToDisplay.length * 2 * 60100) / +tempo.value;
  workoutInProgress.value = !workoutInProgress.value;
  if (workoutInProgress.value) {
    console.log("workout started");
    setTimeout(() => {
      scaleComponent.value.toggleAudio();
    }, 100);
    //whilst workout config end note is not reached, change note after each scale repitition
    interval = setInterval(() => {
      if (!workoutInProgress.value) {
        clearInterval(interval);
        return;
      }
      scaleConfig.value.selectedNote =
        notes[
          notes.findIndex(
            (note) => note.name === scaleConfig.value.selectedNote
          ) + direction
        ].name;
      if (scaleConfig.value.selectedNote === workoutConfig.endNote) {
        // if not roundtrip or have reached end note after round trip stop workout
        if (!workoutConfig.roundTrip || direction === -1) {
          clearInterval(interval);
          workoutInProgress.value = false;
          // reset to start note after workout is complete
          setTimeout(() => {
            scaleConfig.value.selectedNote = workoutConfig.startNote;
          }, scaleDuration);
        } else {
          // if roundtrip and reached ascending end note, reverse direction
          workoutConfig.endNote = workoutConfig.startNote;
          direction = -1;
        }
      }
      //delay to allow for notes to load
      setTimeout(() => {
        scaleComponent.value.toggleAudio();
      }, 100);
    }, scaleDuration);
  } else {
    console.log("workout stopped");
    scaleComponent.value.toggleAudio();
    scaleConfig.value.selectedNote = workoutConfig.startNote;
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
          <Dropdown width="full">
            <template #trigger>
              <button class="flex relative w-full justify-center items-center" @click="console.log('configure workout')">
                Configure
                <FontAwesomeIcon class="absolute right-4" :icon="faChevronDown" />
              </button>
            </template>
            <template #content>
              <WorkoutConfig />
            </template>
          </Dropdown>
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
      :workoutMode = "tabsComponent.currentTab === 'workout'"
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
