<template>
  <div class="grid-rows-2 w-full bg-gradient-to-br from-sky-300 to-indigo-400 p-2 rounded-md border-2 border-black shadow-lg">
    <div class="flex max-sm:flex-wrap w-full gap-2 m-auto">
      <div class="flex items-center gap-2 lg:w-1/2 w-full">
        <div class="flex flex-col w-fit items-start">
          <label for="note">Root Note</label>
          <select id="note" v-model="scaleConfig.selectedNote">
            <option v-for="(note, index) in availableRootNotes" :key="index">
              {{ note.name }}
            </option>
          </select>
        </div>
        <div class="flex flex-col w-full items-start">
          <text-carousel
            ref="textCarouselComponent"
            :items="['Scales', 'Arpeggios']"
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
      <div class="flex-col lg:w-1/2 w-full">
        <div class="font-medium flex justify-between items-end pb-2">
          Note Order<button
            class="rounded-full h-8 flex items-center inverted-btn text-sm"
            @click="scaleConfig.noteOrder = null"
          >
            Reset
          </button>
        </div>
        <div class="flex w-full justify-evenly items-center gap-2">
          <button
            :class="btnClass"
            @click="
              scaleConfig.noteOrder = scaleToDisplay
                .map((note) => note.position)
                .reverse()
            "
          >
            Reverse
          </button>
          <button
            :class="btnClass"
            @click="
              scaleConfig.noteOrder = scaleToDisplay
                .map((note) => note.position)
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
    <div class="relative flex mt-4 w-full justify-between items-center">
      <div class="flex gap-2 items-center">
          <label for="grid-type">Grid type: </label>
          <div @click="() => selectedGridType = 'Guitar tab'" role="button" class="border py-1 px-2 rounded-lg" :class="{'bg-teal-200' : selectedGridType == 'Guitar tab'}">Guitar tab</div>
          <div @click="() => selectedGridType = 'Piano roll'" role="button" class="border py-1 px-2 rounded-lg" :class="{'bg-teal-200' : selectedGridType == 'Piano roll'}">Piano roll</div>
      </div>
        <font-awesome-icon role="button" @click="showSettings = !showSettings" size="lg" :icon="faCog"></font-awesome-icon>
      <playback-settings v-if="showSettings"></playback-settings>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, computed, ref } from "vue";
import { Scales, PresetNoteOrders } from "../types";
import { scales, notes, guitarScaleStringPatterns } from "../NotesAndScales";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis, faRefresh, faCog } from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "./reuseable/DropdownButton.vue";
import PlaybackSettings from "./PlayBackSettings.vue";
import {
  workoutConfig,
  scaleConfig,
  scaleToDisplay,
  selectedPreset,
  presetNoteOrders,
  selectedGridType
} from "../GlobalState";
import TextCarousel from "./reuseable/TextCarousel.vue";
import scaleManipulator from "../utils/scaleManipulator";

const props = defineProps<{
  workoutMode: boolean;
}>();

const showSettings = ref(false);
const scaleNames = Object.keys(scales);
const btnClass = "flex grow justify-center items-center";
// root notes can only be up to C6
// @ts-ignore
const rootNotes = notes.filter((note, index) => index <= 48);

const availableRootNotes = computed(() => {
  if(selectedGridType.value === "Guitar tab") {
    const rootNotesCopy = [...rootNotes];
    return rootNotesCopy.splice(4, 30);
  } else {
    return rootNotes;
  }
});

const presets = computed(() => {
  const presetsKey =
    `presets${scaleToDisplay.value.length.toString()}` as keyof PresetNoteOrders;
  return presetNoteOrders[presetsKey];
});

const getScaleOptions = computed(() => {
  // if carousel is on Scales, return scale names
  if (textCarouselComponent.value.itemsRef[0] === "Scales") {
    // set selected scale to first scale in list
    scaleConfig.selectedScale = scaleNames[0] as keyof Scales;
    return scaleNames.filter((scale) => !scale.includes("Arpeggio"));
  } else {
    // if carousel is on Arpeggios, set selected scale to first arpeggio in list
    scaleConfig.selectedScale = scaleNames.filter((scale) =>
      scale.includes("Arpeggio")
    )[0] as keyof Scales;
    // if carousel is on Arpeggios, return arpeggio names
    return scaleNames.filter((scale) => scale.includes("Arpeggio"));
  }
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

const textCarouselComponent = ref({
  itemsRef: ["Scales", "Arpeggios"],
});

defineExpose({
  scaleToDisplay,
});
</script>
