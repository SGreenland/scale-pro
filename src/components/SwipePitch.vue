<template>
  <div class="flex justify-between lg:w-2/3 w-full m-auto py-2 dark:text-white">
    <div class="flex">
      <span class="px-2">DN</span>
      <font-awesome-icon :icon="faChevronLeft" size="xl" />
      <font-awesome-icon :icon="faChevronLeft" size="xl" />
      <font-awesome-icon :icon="faChevronLeft" size="xl" />
      <font-awesome-icon :icon="faChevronLeft" size="xl" />
    </div>
    <p
      ref="swipeStartEl"
      @touchstart="(e) => (touchStartTime = e.timeStamp)"
      @touchend="handleSwipe"
      @touchmove="animateSwipe"
      class="absolute w-fit left-0 right-0 m-auto"
    >
      SWIPE PITCH
    </p>
    <div class="flex">
      <font-awesome-icon :icon="faChevronRight" size="xl" />
      <font-awesome-icon :icon="faChevronRight" size="xl" />
      <font-awesome-icon :icon="faChevronRight" size="xl" />
      <font-awesome-icon :icon="faChevronRight" size="xl" />
      <span class="px-2">UP</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { notes } from "../NotesAndScales";
import { ref } from "vue";

const props = defineProps<{
  rootNote: string;
}>();

const touchStartTime = ref<number>(0);
const swipeStartEl = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: "pitchChange", value: string): void;
}>();

const handleSwipe = (event: TouchEvent) => {
  event.preventDefault();
  //return if just a tap
  if (event.timeStamp - touchStartTime.value < 200) return;
  // remove all colors
  document.querySelectorAll("svg").forEach((el) => {
    el.classList.remove("text-red-500");
    el.classList.remove("text-green-500");
  });
  //determine if swipe is left or right
  if (
    event.changedTouches[0].clientX < swipeStartEl.value!.getBoundingClientRect().left
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

const animateSwipe = (event: TouchEvent) => {
  event.preventDefault();
  document.elementsFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY)?.forEach((el) => {
    if (el.tagName === "svg") {
      if (
        event.changedTouches[0].clientX < swipeStartEl.value!.getBoundingClientRect().left
      ) {
        el.classList.add("text-red-500");
      } else el.classList.add("text-green-500");
    }
  }
);
};
</script>

<style scoped></style>
