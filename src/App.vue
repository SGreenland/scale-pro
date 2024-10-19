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
        // if selectedNote is endNote and no multiple scales, workout is complete
        if (workoutConfig.scales.length === 1) {
          clearInterval(interval);
          workoutInProgress.value = false;
          // reset to start note after workout is complete
          setTimeout(() => {
            scaleConfig.value.selectedNote = workoutConfig.startNote;
          }, scaleDuration);
          return;
        }
        if (workoutConfig.scales.length > 1) {
          const currentScaleIndex = workoutConfig.scales.indexOf(
            scaleConfig.value.selectedScaleType
          );
          if (currentScaleIndex + 1 < workoutConfig.scales.length) {
            //@ts-ignore
            scaleConfig.value.selectedScaleType =
              workoutConfig.scales[currentScaleIndex + 1];
            clearInterval(interval);
            workoutInProgress.value = false;
            console.log("toggling workout again");
            toggleWorkout();
          } else {
            workoutInProgress.value = false;
            clearInterval(interval);
            //@ts-ignore
            scaleConfig.value.selectedScaleType = workoutConfig.scales[0];
          }
        } else {
          // reset to start note after workout is complete
          setTimeout(() => {
            scaleConfig.value.selectedNote = workoutConfig.startNote;
          }, scaleDuration);
        }
      }
    }, scaleDuration);
  } else {
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
      class="lg:w-2/3 w-full m-auto flex flex-col gap-3"
      :tabs="['practice', 'workout']"
    >
      <template #practice> </template>
      <template #workout>
          <WorkoutConfig />
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
        @toggleWorkout="toggleWorkout"
      ></audio-controls>
    </div>
    <!-- <swipe-pitch :root-note="scaleConfig.selectedNote" @pitch-change="handlePitchChange" /> -->
  </div>
</template>
