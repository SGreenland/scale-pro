<template>
  <div class="grid gap-2 m-auto">
    <div class="flex items-center gap-2 w-full">
      <div class="flex flex-col w-fit items-start">
        <label class="font-medium" for="note">Root Note:</label>
        <select id="note" v-model="selectedNote">
          <option v-for="(note, index) in rootNotes" :key="index">
            {{ note.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col w-full items-start">
        <label class="font-medium" for="scale">Scale:</label>
        <select class="flex w-full" id="scale" v-model="selectedScaleType">
          <option v-for="(name, index) in scaleNames" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
    </div>
    <div class="flex w-full justify-evenly items-center gap-2">
      <button @click="scaleToDisplay = reverseScale(scaleToDisplay)">
        Reverse
      </button>
      <button @click="scaleToDisplay = shuffleScale(scaleToDisplay)">
        Shuffle
      </button>
      <button
        @click="scaleToDisplay = getScale(selectedNote, selectedScaleType)"
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
              v-if="!selectedScaleType.includes('Pentatonic')"
              v-for="(preset, index) in presets8"
              :key="index"
              @click="applyPreset"
            >
              {{ preset }}
            </button>
            <button
              v-else
              v-for="(preset, index) in presets5"
              :key="index + 1"
              @click="applyPreset"
            >
              {{ preset }}
            </button>
          </div>
        </template>
      </dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Ref } from "vue";
import { Scales, Note } from "../types";
import { scales, notes } from "../NotesAndScales";
import scaleManipulator from "../utils/scaleManipulator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./reuseable/Dropdown.vue";

const { getScale, reverseScale, shuffleScale, reorderScale } =
  scaleManipulator();

const scaleNames = Object.keys(scales);
const selectedNote: Ref<string> = ref("C4");
const selectedScaleType: Ref<keyof Scales> = ref("Major");
// roote notes can only be up to C6
// @ts-ignore
const rootNotes = notes.filter((note, index) => index <= 48);
// const templates = [''];
const scaleToDisplay: Ref<Note[]> = ref(
  getScale(selectedNote.value, selectedScaleType.value)
);
const originalOrder = ref(scaleToDisplay.value.map((note) => note.name));
const presets8 = [
  "1 3 5 7 2 4 6 8",
  "1 6 2 4 3 7 5 8",
  "1 5 3 7 2 6 4 8",
  "1 4 2 6 3 7 5 8",
  "1 3 5 7 8 6 4 2",
  "1 6 2 4 5 7 3 8",
  "1 5 3 7 8 6 4 2",
  "1 4 2 6 8 7 5 3",
  "1 1 1 1 1 1 1 1",
];

const presets5 = [
  "1 3 5 2 4",
  "1 5 3 2 4",
  "1 4 2 5 3",
  "1 3 5 4 2",
  "1 5 3 4 2",
  "1 4 2 3 5",
];

function applyPreset(event: Event) {
  const element = event?.target as HTMLButtonElement;
  const presetString = element.textContent;
  const presetOrder: number[] =
    presetString?.split(" ").map((note: string) => +note) ?? [];
  scaleToDisplay.value = reorderScale(scaleToDisplay.value, presetOrder);
}

watch([selectedNote, selectedScaleType], () => {
  scaleToDisplay.value = getScale(selectedNote.value, selectedScaleType.value);
  originalOrder.value = scaleToDisplay.value?.map((note) => note.name);
});

defineExpose({
  scaleToDisplay,
  originalOrder,
});
</script>
