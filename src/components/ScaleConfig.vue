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
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Ref } from "vue";
import { Scales, Note, PresetNoteOrders } from "../types";
import { scales, notes } from "../NotesAndScales";
import { presetNoteOrders } from "../PresetStore";
import scaleManipulator from "../utils/scaleManipulator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./reuseable/Dropdown.vue";

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

const presets = computed(() => {
   const presetsKey = `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
   return presetNoteOrders[presetsKey];
 });

function applyPreset(event: Event) {
  const element = event?.target as HTMLButtonElement;
  const presetString = element.textContent;
  const presetOrder: number[] =
    presetString?.split(" ").map((note: string) => +note) ?? [];
  scaleToDisplay.value = reorderScale(selectedScaleInOrder.value, presetOrder);
}

watch([selectedNote, selectedScaleType], () => {
  //keep old order if same length
  if(selectedScaleInOrder.value.length === scaleToDisplay.value.length) {
    scaleToDisplay.value = reorderScale(selectedScaleInOrder.value, scaleToDisplay.value.map((note) => note.interval));
    return;
  }
  scaleToDisplay.value = selectedScaleInOrder.value;
});

defineExpose({
  scaleToDisplay,
});
</script>
