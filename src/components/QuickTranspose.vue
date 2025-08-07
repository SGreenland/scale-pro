<template>
  <div class="flex flex-col">
    <!-- <div class="flex">
      <label>Quick Transpose</label>
    </div> -->
    <div class="flex gap-1 items-center">
      <button
        class="inverted-btn w-10 input flex items-center justify-center"
        @click="(e) => handleClick('down', e)"
        @touchstart="() => handleLongPressStart('down')"
        @touchend="cancelHold"
      >
        <FontAwesomeIcon :icon="faCaretDown" size="2xl" />
      </button>
      <slot></slot>
      <button
        class="inverted-btn w-10 input flex items-center justify-center"
        @click="(e) => handleClick('up', e)"
        @touchstart="() => handleLongPressStart('up')"
        @touchend="cancelHold"
      >
        <FontAwesomeIcon
          :icon="faCaretUp"
          size="2xl"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  faCaretDown,
  faCaretUp
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { scaleConfig } from "../GlobalState";
import { notes } from "../NotesAndScales";
import { Note } from "../types";

const props = defineProps<{
  availableRootNotes?: Note[] | undefined;
}>();

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

function handleClick(direction: "up" | "down", event: MouseEvent) {
  transposeScale(
    event.shiftKey
      ? direction === "up"
        ? "octave-up"
        : "octave-down"
      : direction
  );
}

function handleLongPressStart(direction: "up" | "down") {
  holdTimeout = setTimeout(() => {
    transposeScale(direction === "up" ? "octave-up" : "octave-down");
    holdTimeout = null;
  }, 600);
}

function cancelHold() {
  if (holdTimeout) {
    clearTimeout(holdTimeout);
    holdTimeout = null;
  }
}
</script>

<style scoped></style>
