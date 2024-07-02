<template>
  <div
    :class="`grid max-sm:text-xs md:gap-2 gap-1 lg:w-2/3 w-full m-auto`"
    :style="{
      gridTemplateColumns: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${scaleToDisplay.length}, minmax(0, 1fr))`,
    }"
  >
    <div
      v-if="notesAreReady"
      v-for="(note, index) in scaleToDisplay"
      :key="index"
      ref="notes"
      @click="!audioIsPlaying && playNote(note.audioSrc, index)"
      class="p-2 bg-blue-100 rounded-lg w-full h-full flex items-center justify-center cursor-pointer"
      :style="{
        gridRowStart: scaleToDisplay.length - originalOrder.indexOf(note.name),
        gridColumnStart: index + 1,
      }"
    >
      <span
        >{{ getNoteName(note.name)
        }}<small>({{ originalOrder.indexOf(note.name) + 1 }})</small></span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUpdated } from "vue";
import type { ComputedRef } from "vue";
import { Note } from "../types";
import scaleManipulator from "../utils/scaleManipulator";

const { reverseScale } = scaleManipulator();

const notesAreReady = ref(false);

onUpdated(() => {
    notesAreReady.value = true;
});

function getNoteName(note: string) {
  if (note.includes("sharp")) {
    return note.replace("sharp", "#");
  }
  return note;
}

const props = defineProps<{
  scaleToDisplay: Note[];
  originalOrder: string[];
  tempo: string;
}>();

const notes = ref<any[]>();
const audioIsPlaying = ref(false);

const animationInterval = computed(() => 60000 / +props.tempo);

const playNote = (audioSrc: string, index: number) => {
  // add animation to note
  notes.value?.findIndex((el, i) => {
    if (i === index) {
      el.style.animation = `bounce ${animationInterval.value}ms ease-out`;
      setTimeout(() => {
        el.style.animation = "";
      }, animationInterval.value);
    }
  });
  const audio = new Audio(audioSrc);
  audio.play();
};

let sequences: number[] = [];
const reversedScaleMinusFirstNote: ComputedRef<Note[]> = computed(() =>
  reverseScale(props.scaleToDisplay).slice(1)
);

const toggleAudio = (isForwardsAndBackwards: boolean, shouldLoop: boolean) => {
  if (!audioIsPlaying.value) {
    audioIsPlaying.value = true;
    props.scaleToDisplay.forEach((note, index) => {
      const timeoutId = setTimeout(() => {
        playNote(note.audioSrc, index);
      }, index * (60000 / +props.tempo));
      sequences.push(timeoutId);
    });
    if (isForwardsAndBackwards) {
      reversedScaleMinusFirstNote.value.forEach((note, index) => {
        const timeoutId = setTimeout(() => {
          // get the correct note index
          const noteIndex = props.scaleToDisplay.length - 2 - index;
          playNote(note.audioSrc, noteIndex);
        }, index * (60000 / +props.tempo) + props.scaleToDisplay.length * (60000 / +props.tempo));
        sequences.push(timeoutId);
      });
    }
    // need to set audio playing as false once all notes have played
    const timeoutId = setTimeout(() => {
      shouldLoop ? (audioIsPlaying.value = false, toggleAudio(isForwardsAndBackwards, shouldLoop)) : audioIsPlaying.value = false;
    }, props.scaleToDisplay.length * (60000 / +props.tempo) * (isForwardsAndBackwards ? 2 : 1));
    sequences.push(timeoutId);
  } else { // stop audio
    sequences.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    audioIsPlaying.value = false;
  }
};

defineExpose({
  toggleAudio,
  audioIsPlaying,
});
</script>

<style>
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
