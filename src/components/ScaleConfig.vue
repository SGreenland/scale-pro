<template>
  <div class="grid  w-full grid-cols-2 gap-x-3 m-auto max-w-3xl">
    <div class="col-span-2 md:col-span-1 grid grid-cols-6 gap-3 w-full">
      <div class="col-span-2 flex flex-col items-start">
        <label class="text-sm font-bold mb-2" for="note">Root Note:</label>
        <select class="w-full" id="note" v-model="selectedNote">
          <option v-for="(note, index) in rootNotes" :key="index">
            {{ note.name }}
          </option>
        </select>
      </div>
      <div class="col-span-4 flex flex-col  items-start">
        <label class="text-sm font-bold mb-2" for="scale">Scale:</label>
        <select class="flex w-full" id="scale" v-model="selectedScaleType">
          <option v-for="(name, index) in scaleNames" :key="index">
            {{ name }}
          </option>
        </select>
      </div>
    </div>


    <div class="col-span-2 md:col-span-1 grid grid-cols-6 gap-x-3 w-full">
      <label class="text-left col-span-full text-sm font-bold mb-2" for="note">Note order:</label>

      <div class="col-span-6 grid gap-x-3 grid-cols-3 items-start">
        <button class="col-span-1" @click="scaleToDisplay = reverseScale(scaleToDisplay)">
          Reverse
        </button>
        <button class="col-span-1" @click="scaleToDisplay = shuffleScale(scaleToDisplay)">
          Shuffle
        </button>

        <div class="col-span-1">
          <dropdown>
            <template #trigger>

              <button class="w-full" for="custom-order">Presets</button>
            </template>
            <template #content>
              <div>
                <hr />
              </div>
              <div class="space-y-2 mt-2 max-h-40 overflow-auto">
                <button v-if="!selectedScaleType.includes('Pentatonic')" v-for="(preset, index) in presets8"
                  :key="index" @click="applyPreset">
                  {{ preset }}
                </button>
                <button v-else v-for="(preset, index) in presets6" :key="index + 1" @click="applyPreset">
                  {{ preset }}
                </button>
              </div>
            </template>
          </dropdown>

        </div>
        <div class="col-span-full flex items-end justify-end pt-3">
          <button
            class="rounded-full text-sm w-auto border py-1 px-3 bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
            @click="scaleToDisplay = getScale(selectedNote, selectedScaleType)">
            Reset
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Ref } from "vue";

import { Scales, Note } from "../types";
import { scales, notes } from "../NotesAndScales";

import scaleManipulator from "../utils/scaleManipulator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Dropdown from "./reuseable/Dropdown.vue";


import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const { getScale, reverseScale, shuffleScale, reorderScale } =
  scaleManipulator();

const scaleNames = Object.keys(scales);
const selectedNote: Ref<string> = ref("C4");
const selectedScaleType: Ref<keyof Scales> = ref("Major");
// root notes can only be up to C6
// @ts-ignore
const rootNotes = notes.filter((note, index) => index <= 48);
const selectedScaleInOrder = computed(() =>
  getScale(selectedNote.value, selectedScaleType.value)
);
const scaleToDisplay: Ref<Note[]> = ref(
  getScale(selectedNote.value, selectedScaleType.value)
);
const presets8 = [
  "1 3 5 7 2 4 6 8",
  "1 6 2 4 3 7 5 8",
  "1 5 3 7 2 6 4 8",
  "1 4 2 6 3 7 5 8",
  "1 3 5 7 8 6 4 2",
  "1 6 2 4 5 7 3 8",
  "1 5 3 7 8 6 4 2",
  "1 4 2 6 8 7 5 3",
];

const presets6 = [
  "1 3 5 2 4 6",
  "1 6 2 4 3 5",
  "1 5 3 2 4 6",
  "1 4 2 3 5 6",
  "1 3 5 6 4 2",
  "1 6 2 5 3 4",
  "1 5 3 6 4 2",
  "1 4 2 5 3 6",
];

function applyPreset(event: Event) {
  const element = event?.target as HTMLButtonElement;
  const presetString = element.textContent;
  const presetOrder: number[] =
    presetString?.split(" ").map((note: string) => +note) ?? [];
  scaleToDisplay.value = reorderScale(selectedScaleInOrder.value, presetOrder);
}

watch([selectedNote, selectedScaleType], () => {
  //keep old order if same length
  if (selectedScaleInOrder.value.length === scaleToDisplay.value.length) {
    scaleToDisplay.value = reorderScale(selectedScaleInOrder.value, scaleToDisplay.value.map((note) => note.interval));
    return;
  }
  scaleToDisplay.value = selectedScaleInOrder.value;
});

defineExpose({
  scaleToDisplay,
});
</script>
