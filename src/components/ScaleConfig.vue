<template>
  <div class="grid-rows-2 w-full bg-gradient-to-br from-sky-300 to-indigo-400 dark:from-sky-600 dark:to-indigo-700 p-2 rounded-md border-2 border-indigo-900 shadow-lg max-sm:pt-4">
    <div class="flex max-sm:flex-wrap w-full gap-2 m-auto">
      <div class="flex items-center gap-2 lg:w-1/2 w-full">
        <div class="flex flex-col w-fit h-full justify-end items-start">
          <label for="note">Root Note</label>
          <quick-transpose
            v-show="!props.workoutMode"
            :availableRootNotes="rootNoteSelector?.availableRootNotes">
          <root-note-selector ref="rootNoteSelector" v-model="scaleConfig.selectedNote"></root-note-selector>
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
            @click="
              scaleConfig.noteOrder = reverse(scaleToDisplay);
            "
          >
            Reverse
          </button>
          <button
            :class="btnClass"
            @click="
              scaleConfig.noteOrder = shuffle(scaleToDisplay);
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
import { computed, onMounted, ref } from "vue";
import useReorderNotes from "../composables/useReorderNotes";
import {
  presetNoteOrders,
  scaleConfig,
  scaleToDisplay,
  settings
} from "../GlobalState";
import { scales } from "../NotesAndScales";
import { PresetNoteOrders } from "../types";
import QuickTranspose from "./QuickTranspose.vue";
import DropdownButton from "./reuseable/DropdownButton.vue";
import TextCarousel from "./reuseable/TextCarousel.vue";
import RootNoteSelector from "./RootNoteSelector.vue";

const { shuffle, reverse } = useReorderNotes();

const rootNoteSelector = ref<InstanceType<typeof RootNoteSelector> | null>(null);


const props = defineProps<{
  workoutMode: boolean;
}>();

const scaleNames = Object.keys(scales);
const btnClass = "flex grow justify-center items-center";

const handleScaleTypeChange = (item: string) => {
  if (item === "Scales") {
    scaleConfig.selectedScale = "Major (1-5)";
  } else {
    scaleConfig.selectedScale = "Major Arpeggio";
  }
};


const presets = computed(() => {
  const presetsKey =
    `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
  return presetNoteOrders[presetsKey];
});

const getScaleOptions = computed(() => {
  // if carousel is on Scales, return scale names
  if (textCarouselComponent.value?.itemsRef[0] === "Scales") {
    return scaleNames.filter((scaleName) => !scaleName.includes("Arpeggio"));
  } else {
    return scaleNames.filter((scale) => scale.includes("Arpeggio"));
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

onMounted(() => {
  //set initial root note and scale based on settings
  scaleConfig.selectedNote = settings.startingRootNote;

  // if settings.startingScale is an arpeggio, change carousel to Arpeggios
  if (settings.startingScale.includes("Arpeggio")) {
    textCarouselComponent.value?.setActiveItem('Arpeggios');
  }
  scaleConfig.selectedScale = settings.startingScale;
});

const textCarouselComponent = ref<InstanceType<typeof TextCarousel> | null>(null);

defineExpose({
  scaleToDisplay,
});
</script>
