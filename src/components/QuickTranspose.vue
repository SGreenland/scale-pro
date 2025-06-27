<template>
  <div class="flex flex-col">
    <div class="flex">
      <label>Quick Transpose</label>
      <!--info icon with tooltip-->
      <div class="relative">
        <FontAwesomeIcon
          ref="transposeInfoIcon"
          :icon="faInfoCircle"
          class="text-indigo-500 ps-1 lg:text-lg text-sm"
        />
        <Tooltip :trigger="transposeInfoIcon">
          <p class="text-sm">
            Click the arrows to transpose the scale up or down by a semitone.
            Shift-click to transpose by an octave. (Press and hold on mobile)
          </p>
        </Tooltip>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        class="inverted-btn size-[30px] flex items-center justify-center"
        @click="(e) => handleClick('down', e)"
        @touchstart="() => handleLongPressStart('down')"
        @touchend="cancelHold"
      >
        <FontAwesomeIcon :icon="faCaretDown" size="2xl" />
      </button>
      <button
        class="inverted-btn size-[30px] flex items-center justify-center"
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
  faCaretUp,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
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
