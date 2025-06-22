<template>
  <div class="flex gap-2 justify-end items-center w-full">
    <!--info icon with tooltip-->
    <div class="relative">
        <FontAwesomeIcon
           ref="transposeInfoIcon"
          :icon="faInfoCircle"
          class="text-black dark:text-white cursor-pointer"
          size="lg"
        />
        <Tooltip :trigger="transposeInfoIcon">
          <p class="text-sm">
            Click the arrows to transpose the scale up or down by a semitone. Shift-click to
            transpose by an octave. (Press and hold on mobile)
          </p>
        </Tooltip>
    </div>

    Quick Transpose:
    <FontAwesomeIcon
        :icon="faCaretDown"
        class="text-red-500/50 cursor-pointer border border-red-500/50 rounded-lg px-2"
        @mousedown="handleMouseDown('down')"
        @mouseup="(e) => handleMouseUp('down', e)"
        @mouseleave="() => holdTimeout && cancelHold()"
        @touchstart="handleTouchStart('down')"
        @touchend="() => handleTouchEnd('down')"
        size="2xl"
        />
        <FontAwesomeIcon
        :icon="faCaretUp"
        class="text-red-500/50 cursor-pointer border border-red-500/50 rounded-lg px-2"
        @mousedown="handleMouseDown('up')"
        @mouseup="(e) => handleMouseUp('up', e)"
        @mouseleave="() => holdTimeout && cancelHold()"
        @touchstart="handleTouchStart('up')"
        @touchend="() => handleTouchEnd('up')"
        size="2xl"
        />

  </div>
</template>

<script setup lang="ts">
import { faCaretDown, faCaretUp, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { scaleConfig } from "../GlobalState";
import { notes } from "../NotesAndScales";
import { Note } from "../types";
import Tooltip from "./reuseable/Tooltip.vue";
import { ComponentPublicInstance, ref } from "vue";

const props = defineProps<{
  availableRootNotes?: Note[] | undefined;
}>();

const transposeInfoIcon = ref<ComponentPublicInstance | null>(null);

function transposeScale(
  direction: "up" | "down" | "octave-up" | "octave-down"
) {
  const currentNote = scaleConfig.selectedNote;
  const currentIndex = notes.findIndex((note) => note.name === currentNote);

  let newIndex = currentIndex;

  switch (direction) {
    case "up":
      newIndex = (currentIndex + 1) % notes.length;
      break;
    case "down":
      newIndex = (currentIndex - 1 + notes.length) % notes.length;
      break;
    case "octave-up":
      newIndex = (currentIndex + 12) % notes.length;
      break;
    case "octave-down":
      newIndex = (currentIndex - 12 + notes.length) % notes.length;
      break;
    default:
      return;
  }

  const newNote = notes[newIndex];
  if (!props.availableRootNotes?.some((note) => note.name === newNote.name)) {
    return;
  }
  scaleConfig.selectedNote = newNote.name;
}

let holdTimeout: ReturnType<typeof setTimeout> | null = null;

function startHold(
  direction: "up" | "down",
  octave: boolean = false
) {
  if (octave) {
    transposeScale(direction === "up" ? "octave-up" : "octave-down");
  } else {
    transposeScale(direction);
  }
}

function handleTouchStart(direction: "up" | "down") {
  holdTimeout = setTimeout(() => {
    startHold(direction, true); // octave
    holdTimeout = null;
  }, 600);
}

function handleTouchEnd(direction: "up" | "down") {
  if (holdTimeout) {
    clearTimeout(holdTimeout);
    startHold(direction); // semitone
  }
}

function handleMouseDown(direction: "up" | "down") {
  holdTimeout = setTimeout(() => {
    startHold(direction, true); // octave
    holdTimeout = null;
  }, 600);
}

function handleMouseUp(direction: "up" | "down", event: MouseEvent) {
  if (holdTimeout) {
    clearTimeout(holdTimeout);
    startHold(direction, event.shiftKey); // shiftKey → octave
  }
}

function cancelHold() {
  if (holdTimeout) {
    clearTimeout(holdTimeout);
    holdTimeout = null;
  }
}

</script>

<style scoped></style>
