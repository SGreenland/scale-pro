<template>
  <div class="flex max-sm:flex-wrap w-full gap-2 m-auto">
    <div class="flex items-center gap-2 lg:w-1/2 w-full">
      <div class="flex flex-col w-fit items-start">
        <label for="note">Root Note</label>
        <select id="note" v-model="scaleConfig.selectedNote">
          <option v-for="(note, index) in rootNotes" :key="index">
            {{ note.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col w-full items-start">
        <label for="scale">Scale</label>
        <select
          class="flex w-full"
          id="scale"
          v-model="scaleConfig.selectedScale"
        >
          <option v-for="(name, index) in scaleNames" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
    </div>
    <!--note order-->
    <div class="flex-col lg:w-1/2 w-full">
      <div class="font-medium flex justify-between pb-2">Note Order<button class="rounded-full h-8 flex items-center inverted-btn text-sm" @click="scaleConfig.noteOrder = null">Reset</button></div>
      <div class="flex w-full justify-evenly items-center gap-2">
        <button
          :class="btnClass"
          @click="
            scaleConfig.noteOrder = scaleToDisplay
              .map((note) => note.interval)
              .reverse()
          "
        >
          Reverse
        </button>
        <button
          :class="btnClass"
          @click="
            scaleConfig.noteOrder = scaleToDisplay
              .map((note) => note.interval)
              .sort(() => Math.random() - 0.5)
          "
        >
          Shuffle
        </button>
        <!-- <button class="flex">
          <font-awesome-icon
            class="size-6"
            :icon="faRefresh"
            @click="scaleConfig.noteOrder = null"
          />
        </button> -->
        <dropdown-button :class="btnClass" button-text="Presets">
            <div class="space-y-2 mt-2 max-h-40 overflow-auto">
              <button
                v-for="(preset, index) in presets"
                :key="index"
                class="text-nowrap"
                @click="scaleConfig.noteOrder = preset"
              >
                {{ preset.toString().replaceAll(',', ' ').trim() }}
              </button>
            </div>
        </dropdown-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed } from "vue";
import { Scales, PresetNoteOrders } from "../types";
import { scales, notes } from "../NotesAndScales";
import { presetNoteOrders } from "../GlobalState";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis, faRefresh } from "@fortawesome/free-solid-svg-icons";
import  DropdownButton  from "./reuseable/DropdownButton.vue";
import {
  workoutConfig,
  scaleConfig,
  scaleToDisplay,
  selectedPreset,
} from "../GlobalState";

const props = defineProps<{
  workoutMode: boolean;
}>();

const scaleNames = Object.keys(scales);
const btnClass = "flex grow justify-center items-center";
// root notes can only be up to C6
// @ts-ignore
const rootNotes = notes.filter((note, index) => index <= 48);

const presets = computed(() => {
  const presetsKey =
    `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
  return presetNoteOrders[presetsKey];
});

watch(
  () => [workoutConfig.startNote, workoutConfig.scales, props.workoutMode],
  () => {
    if (props.workoutMode) {
      scaleConfig.selectedNote = workoutConfig.startNote;
      scaleConfig.selectedScale = workoutConfig.scales[0] as keyof Scales;
      // store practice note order in session storage
      sessionStorage.setItem(
        "practiceNoteOrder",
        JSON.stringify(scaleConfig.noteOrder)
      );
      scaleConfig.noteOrder = null;
    } else {
      scaleConfig.selectedNote = "C4";
      scaleConfig.selectedScale = "Major";
      // get practice note order from session storage
      scaleConfig.noteOrder = JSON.parse(
        sessionStorage.getItem("practiceNoteOrder") || "null"
      );
    }
  },
  { deep: true, immediate: true }
);

defineExpose({
  scaleToDisplay,
});
</script>
