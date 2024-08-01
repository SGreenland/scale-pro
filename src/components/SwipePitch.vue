<template>
  <div
    class="flex justify-between lg:w-2/3 w-full m-auto"
    @touchend="handleSwipe"
  >
    <div class="flex">
      <font-awesome-icon :icon="faArrowLeft" size="xl" />
      <span class="px-2">DOWN</span>
    </div>
    <p class="absolute left-0 right-0 m-auto">SWIPE PITCH</p>
    <div class="flex">
      <span class="px-2">UP</span>
      <font-awesome-icon :icon="faArrowRight" size="xl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { notes } from "../NotesAndScales";

const props = defineProps<{
  rootNote: string;
}>();

const emit = defineEmits<{
  (e: "pitchChange", value: string): void;
}>();

const handleSwipe = (event: TouchEvent) => {
  //determine if swipe is left or right
  const swipeStartEl = event.target as HTMLElement;
  if (
    event.changedTouches[0].clientX < swipeStartEl.getBoundingClientRect().left
  ) {
    //pitch down
    emit(
      "pitchChange",
      notes[notes.findIndex((note) => note.name === props.rootNote) - 1].name
    );
  } else {
    //pitch up
    emit(
      "pitchChange",
      notes[notes.findIndex((note) => note.name === props.rootNote) + 1].name
    );
  }
};
</script>

<style scoped></style>
