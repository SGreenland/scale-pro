<template>
  <div
    class="grid-rows-2 w-full bg-gradient-to-br from-sky-300 to-indigo-400 dark:from-sky-600 dark:to-indigo-700 p-2 rounded-md border-2 border-indigo-900 shadow-lg max-sm:pt-4"
  >
    <div class="flex max-sm:flex-wrap w-full gap-2 m-auto">
      <div class="flex items-center gap-2 lg:w-1/2 w-full">
        <div class="flex flex-col w-fit h-full justify-end items-start">
          <div class="flex gap-1">
            <label for="note">Root Note</label><!--info icon with tooltip-->
                <info-tooltip>
                  Click the arrows to transpose the scale up or down by a semitone.
                  Shift-click to transpose by an octave. (Press and hold on mobile)
                </info-tooltip>
          </div>
          <quick-transpose
            v-show="!props.workoutMode"
            :availableRootNotes="rootNoteSelector?.availableRootNotes"
          >
            <root-note-selector
              class="w-[5.5rem]"
              ref="rootNoteSelector"
              v-model="scaleConfig.selectedNote"
            ></root-note-selector>
          </quick-transpose>
        </div>
        <div class="flex flex-col w-full items-start">
          <text-carousel
            ref="textCarouselComponent"
            :items="['Scales', 'Arpeggios']"
            @item-changed="handleScaleTypeChange"
          ></text-carousel>
          <select
            class="flex w-full"
            id="scale"
            v-model="scaleConfig.selectedScale"
          >
            <option v-for="(name, index) in getScaleOptions" :key="index">
              {{ name }}
            </option>
          </select>
        </div>
      </div>
      <!--note order-->
      <div class="flex flex-col justify-end lg:w-1/2 w-full">
        <div class="font-medium flex justify-between items-end pb-2">
          Note Order<button
            class="rounded-full h-6 flex items-center inverted-btn text-sm"
            @click="scaleConfig.noteOrder = null"
          >
            Reset Order
          </button>
        </div>
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
          <!-- <button class="flex">
          <font-awesome-icon
            class="size-6"
            :icon="faRefresh"
            @click="scaleConfig.noteOrder = null"
          />
        </button> -->
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import useReorderNotes from "../composables/useReorderNotes";
import {
  presetNoteOrders,
  scaleConfig,
  scaleToDisplay,
  settings,
} from "../GlobalState";
import { scales } from "../NotesAndScales";
import { PresetNoteOrders, Scales } from "../types";
import { hasFullAccess } from "../utils/checkUserAccess";
import QuickTranspose from "./QuickTranspose.vue";
import DropdownButton from "./reuseable/DropdownButton.vue";
import TextCarousel from "./reuseable/TextCarousel.vue";
import RootNoteSelector from "./RootNoteSelector.vue";
import InfoTooltip from "./reuseable/InfoTooltip.vue";

const { shuffle, reverse } = useReorderNotes();

const rootNoteSelector = ref<InstanceType<typeof RootNoteSelector> | null>(
  null
);

const props = defineProps<{
  workoutMode: boolean;
}>();

const scaleNames = Object.keys(scales);
const getAvailableScalesPerUser = (): (keyof Scales)[] => {
  return hasFullAccess()
    ? (scaleNames as (keyof Scales)[])
    : (scaleNames.slice(0, 3) as (keyof Scales)[]);
};

const btnClass = "flex grow justify-center items-center";

const handleScaleTypeChange = (item: string) => {
  //this is disgusting sorry about me
  if (item === "Scales" && scaleConfig.selectedScale.includes("Arpeggio")) {
    scaleConfig.selectedScale = "Major";
  } else if (item === "Arpeggios" && !scaleConfig.selectedScale.includes("Arpeggio")) {
    scaleConfig.selectedScale = "Major Arpeggio";
  }
};

const presets = computed(() => {
  const presetsKey =
    `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
  return presetNoteOrders[presetsKey];
});

const availableScales = getAvailableScalesPerUser();

const getScaleOptions = computed(() => {
  let scalesList: (keyof Scales)[] = [];
  switch (textCarouselComponent.value?.activeItem) {
    case "Scales":
      scalesList = availableScales.filter(
        (scaleName) => !scaleName.includes("Arpeggio")
      );
      break;
    case "Arpeggios":
      scalesList = availableScales.filter((scale) =>
        scale.includes("Arpeggio")
      );
      break;
    default:
      scalesList = availableScales;
      break;
  }
  return scalesList;
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

onMounted(() => {
  if (settings.startingScale.includes("Arpeggio") || scaleConfig.selectedScale.includes("Arpeggio")) {
    textCarouselComponent.value?.setActiveItem("Arpeggios");
  }
});

//watch for changes in settings and update scaleConfig accordingly
watch(
  [() => settings.startingScale, () => settings.startingRootNote],
  ([newScale, newRootNote]: [keyof Scales, string]) => {
    scaleConfig.selectedScale = newScale;
    scaleConfig.selectedNote = newRootNote;
  }
);

const textCarouselComponent = ref<InstanceType<typeof TextCarousel> | null>(
  null
);

defineExpose({
  scaleToDisplay,
});
</script>
