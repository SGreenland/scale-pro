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
      <div class="font-medium text-left">Note Order</div>
      <div class="flex w-full justify-evenly items-center gap-2">
        <button
          :class="btnClass"
          @click="scaleConfig.noteOrder = scaleToDisplay.map((note) => note.interval).reverse()"
        >
          Reverse
        </button>
        <button
          :class="btnClass"
          @click="scaleConfig.noteOrder = scaleToDisplay.map((note) => note.interval).sort(() => Math.random() - 0.5)"
        >
          Shuffle
        </button>
        <button
          :class="btnClass"
          @click="scaleConfig.noteOrder = null"
        >
          Reset
        </button>
        <dropdown>
          <template #trigger>
            <font-awesome-icon
              class="rotate-90 cursor-pointer"
              size="lg"
              :icon="faEllipsis"
            />
          </template>
          <template #content>
            <div>
              <label class="mb-1" for="custom-order"><b>Presets: </b></label>
              <hr />
            </div>
            <div class="space-y-2 mt-2 max-h-40 overflow-auto">
              <button
                v-for="(preset, index) in presets"
                :key="index"
                @click="applyPreset"
              >
                {{ preset }}
              </button>
            </div>
          </template>
        </dropdown>
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
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./reuseable/Dropdown.vue";
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

function applyPreset(event: Event) {
  const element = event?.target as HTMLButtonElement;
  const presetString = element.textContent;
  selectedPreset.value =
    presetString?.split(" ").map((note: string) => +note) ?? [];
}

watch(
  () => [workoutConfig.startNote, workoutConfig.scales, props.workoutMode],
  () => {
    if (props.workoutMode) {
      scaleConfig.selectedNote = workoutConfig.startNote;
      scaleConfig.selectedScale = workoutConfig.scales[0] as keyof Scales;
    } else {
      scaleConfig.selectedNote = "C4";
      scaleConfig.selectedScale = "Major";
    }
  },
  { deep: true, immediate: true }
);

defineExpose({
  scaleToDisplay,
});
</script>
