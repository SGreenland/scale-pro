<template>
  <div class="flex max-sm:flex-wrap w-full gap-2 m-auto">
    <div class="flex items-center gap-2 lg:w-1/2 w-full">
      <div class="flex flex-col w-fit items-start">
        <label for="note">Root Note</label>
        <select id="note" v-model="selectedNote">
          <option v-for="(note, index) in rootNotes" :key="index">
            {{ note.name }}
          </option>
        </select>
      </div>
      <div class="flex flex-col w-full items-start">
        <label for="scale">Scale</label>
        <select class="flex w-full" id="scale" v-model="selectedScaleType">
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
          @click="scaleToDisplay = reverseScale(scaleToDisplay)"
        >
          Reverse
        </button>
        <button
          :class="btnClass"
          @click="scaleToDisplay = shuffleScale(scaleToDisplay)"
        >
          Shuffle
        </button>
        <button
          :class="btnClass"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Ref } from "vue";
import { Scales, Note, PresetNoteOrders } from "../types";
import { scales, notes } from "../NotesAndScales";
import { presetNoteOrders } from "../GlobalState";
import scaleManipulator from "../utils/scaleManipulator";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./reuseable/Dropdown.vue";
import { workoutConfig } from "../GlobalState";

const { getScale, reverseScale, shuffleScale, reorderScale } =
  scaleManipulator();

const props = defineProps<{
  workoutMode: boolean;
}>();

const scaleNames = Object.keys(scales);
// to do: need to set as computed property that takes workoutconfig into account
const selectedNote: Ref<string> = ref("C4");
const selectedScaleType: Ref<keyof Scales> = ref("Major");
const btnClass = "flex grow justify-center items-center";
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
  const presetsKey =
    `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
  return presetNoteOrders[presetsKey];
});

function applyPreset(event: Event) {
  const element = event?.target as HTMLButtonElement;
  const presetString = element.textContent;
  const presetOrder: number[] =
    presetString?.split(" ").map((note: string) => +note) ?? [];
  scaleToDisplay.value = reorderScale(selectedScaleInOrder.value, presetOrder);
}

watch(
  () => [workoutConfig.startNote, workoutConfig.scale, props.workoutMode],
  () => {
    if (props.workoutMode) {
      selectedNote.value = workoutConfig.startNote;
      selectedScaleType.value = workoutConfig.scale;
    }
    else {
      selectedNote.value = "C4";
      selectedScaleType.value = "Major";
    }
  },
  { deep: true, immediate: true }
);

watch([selectedNote, selectedScaleType], () => {
  //keep old order if same length
  if (selectedScaleInOrder.value.length === scaleToDisplay.value.length) {
    scaleToDisplay.value = reorderScale(
      selectedScaleInOrder.value,
      scaleToDisplay.value.map((note) => note.interval)
    );
    return;
  }
  scaleToDisplay.value = selectedScaleInOrder.value;
});

defineExpose({
  scaleToDisplay,
  selectedScaleType,
  selectedNote,
});
</script>
