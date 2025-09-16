<template>
  <div
    class="grid-rows-2 w-full bg-gradient-to-br from-sky-300 to-indigo-400 dark:from-sky-600 dark:to-indigo-700 p-2 rounded-md border-2 border-indigo-900 shadow-lg"
  >
    <div class="flex max-md:flex-wrap w-full gap-2 m-auto">
      <div class="flex items-center gap-2 lg:w-1/2 w-full">
        <div class="flex flex-col w-fit h-full justify-end items-start">
          <div class="flex gap-1">
            <label for="note">Root Note</label
            ><!--info icon with tooltip-->
            <info-tooltip>
              Click the arrows to transpose the scale up or down by a semitone.
              Shift-click to transpose by an octave. (Press and hold on mobile)
            </info-tooltip>
          </div>
          <quick-transpose
            class="max-sm:w-[160px]"
            v-show="!props.workoutMode"
            :availableRootNotes="rootNoteSelector?.availableRootNotes"
          >
            <root-note-selector
              class="w-20 pe-0"
              ref="rootNoteSelector"
              v-model="scaleConfig.selectedNote"
            ></root-note-selector>
          </quick-transpose>
        </div>
        <div
          class="flex flex-col size-full items-start justify-end md:min-w-[175px] min-w-none"
        >
          <label for="note-pattern">{{
            selectedPatternCategory.slice(0, -1)
          }}</label>
          <div class="flex w-full gap-2">
            <select
              class="grow"
              id="note-pattern"
              v-model="scaleConfig.selectedPattern"
            >
              <option
                :value="pattern"
                v-for="(pattern, index) in getPatternOptions"
                :key="index"
              >
                {{ pattern.name }}
              </option>
            </select>
            <dropdown class="self-center" :closeContentOnClick="true">
              <template #trigger>
                <font-awesome-icon
                  role="button"
                  :icon="faEllipsisV"
                  size="xl"
                />
              </template>
              <template #content>
              <div class="grid gap-2 p-2">
                <b class="border-b">Choose Category: </b>
                <button
                  v-for="category in ['Scales', 'Arpeggios', 'Intervals']"
                  :key="category"
                  @click="selectedPatternCategory = category"
                  :class="
                    {
                      'bg-indigo-500 text-white':
                        selectedPatternCategory === category,
                      'hover:bg-indigo-200 dark:hover:bg-indigo-600':
                        selectedPatternCategory !== category,
                    } + ' rounded-md px-2 py-1 text-left'
                  "
                >
                  {{ category }}
                </button>
              </div>
              </template>
            </dropdown>
          </div>
        </div>
      </div>
      <!--note order-->
      <div class="flex flex-col justify-end lg:w-1/2 w-full">
        <!-- <div class="font-medium flex justify-between items-end pb-2">
          Note Order
        </div> -->
        <tabs
          ref="tabs"
          active-color="indigo"
          :tabs="['pitch-tracking', 'note-order']"
        >
          <div
            :class="{ hidden: tabs?.currentTab !== 'pitch-tracking' }"
            id="pitch-tracking-template"
          ></div>
          <template #note-order>
            <div class="flex w-full justify-evenly items-center gap-2">
              <button
                :class="btnClass"
                @click="scaleConfig.noteOrder = reverse(scaleToDisplay)"
              >
                Reverse
              </button>
              <button
                :class="btnClass"
                @click="scaleConfig.noteOrder = shuffle(scaleToDisplay)"
              >
                Shuffle
              </button>
              <dropdown-button :class="btnClass" button-text="Presets">
                <div class="grid space-y-2 p-2 mt-2 max-h-40 overflow-auto">
                  <button
                    v-for="(preset, index) in presets"
                    :key="index"
                    class="text-nowrap"
                    @click="
                      scaleConfig.noteOrder = preset.map((value) => value - 1)
                    "
                  >
                    {{ preset.toString().replaceAll(",", " ").trim() }}
                  </button>
                </div>
              </dropdown-button>
              <button
                class="flex size-10 center-xy inverted-btn text-[0.8rem] px-2"
                @click="scaleConfig.noteOrder = null"
              >
                <font-awesome-icon
                  size="xl"
                  :icon="faRefresh"
                ></font-awesome-icon>
              </button>
            </div>
          </template>
        </tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faEllipsisV, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NotePattern } from "packages/shared-types/dist";
import { computed, ref, watch } from "vue";
import useReorderNotes from "../composables/useReorderNotes";
import {
  currentLoggedInUser,
  presetNoteOrders,
  scaleConfig,
  scaleToDisplay,
} from "../GlobalState";
import { notePatterns } from "../NotesAndScales";
import { PresetNoteOrders } from "../types";
import QuickTranspose from "./QuickTranspose.vue";
import Dropdown from "./reuseable/Dropdown.vue";
import DropdownButton from "./reuseable/DropdownButton.vue";
import InfoTooltip from "./reuseable/InfoTooltip.vue";
import Tabs from "./reuseable/Tabs.vue";
import RootNoteSelector from "./RootNoteSelector.vue";

const tabs = ref<InstanceType<typeof Tabs> | null>(null);

const { shuffle, reverse } = useReorderNotes();

const rootNoteSelector = ref<InstanceType<typeof RootNoteSelector> | null>(
  null
);

const props = defineProps<{
  workoutMode: boolean;
}>();

// const scaleNames = notePatterns.map((pattern) => pattern.name);

const getAvailablePatternsPerUser = (): NotePattern[] => {
  return currentLoggedInUser.value?.hasPremiumAccess
    ? notePatterns
    : notePatterns.filter((pattern) => !pattern.isPremium);
};

const btnClass = "flex grow justify-center items-center";

const presets = computed(() => {
  const presetsKey =
    `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
  return presetNoteOrders[presetsKey];
});

const availablePatterns = getAvailablePatternsPerUser();
const selectedPatternCategory = ref("Scales");

const getPatternOptions = computed(() => {
  return availablePatterns.filter(
    (pattern) => pattern.type === selectedPatternCategory.value.slice(0, -1).toLowerCase()
  );
});

watch(() => getPatternOptions.value, (newPatterns) => {
  if (!newPatterns.includes(scaleConfig.selectedPattern)) {
    scaleConfig.selectedPattern = newPatterns[0];
  }
});

// watch(
//   () => [workoutConfig.startNote, workoutConfig.scales, props.workoutMode],
//   () => {
//     if (props.workoutMode) {
//       scaleConfig.selectedNote = workoutConfig.startNote;
//       scaleConfig.selectedScale = workoutConfig.scales[0] as keyof Scales;
//       // store practice note order in session storage
//       sessionStorage.setItem(
//         "practiceNoteOrder",
//         JSON.stringify(scaleConfig.noteOrder)
//       );
//       scaleConfig.noteOrder = null;
//     } else {
//       scaleConfig.selectedNote = "C3";
//       scaleConfig.selectedScale = "Major (1-5)";
//       // get practice note order from session storage
//       scaleConfig.noteOrder = JSON.parse(
//         sessionStorage.getItem("practiceNoteOrder") || "null"
//       );
//     }
//   },
//   { deep: true, immediate: true }
// );

// watch(
//   () => scaleConfig.selectedScale,
//   (newScale) => {
//     nextTick(() => {
//       if (newScale.includes("Arpeggio")) {
//         textCarouselComponent.value?.setActiveItem("Arpeggios");
//       }
//     });
//   },
//   { immediate: true }
// );

// const textCarouselComponent = ref<InstanceType<typeof TextCarousel> | null>(
//   null
// );

defineExpose({
  scaleToDisplay,
});
</script>
