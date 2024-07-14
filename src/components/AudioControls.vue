<template>
  <div class="flex w-fit items-center m-auto gap-4">
    <div
      @click="playBackOptions.shouldLoop = !playBackOptions.shouldLoop"
      class="flex center-xy py-1 px-2 size-10 rounded-lg cursor-pointer border-2 border-blue-300"
      :class="{ 'bg-blue-200 dark:bg-blue-400': playBackOptions.shouldLoop }"
    >
      <font-awesome-icon :icon="faRepeat" size="lg" />
    </div>
    <button
      class="disabled:opacity-50 h-10 flex items-center focus:outline-none"
      :class="{ 'bg-red-200 dark:bg-red-500': audioIsPlaying }"
      @click="$emit('toggleAudio', playBackOptions.isRoundTrip, playBackOptions.shouldLoop)"
    >
      <font-awesome-icon :icon="audioIsPlaying ? faStop : faPlay" />
    </button>
    <div
      @click="playBackOptions.isRoundTrip = !playBackOptions.isRoundTrip"
      class="flex center-xy flex-col py-1 px-2 size-10 rounded-lg cursor-pointer border-2 border-blue-300"
      :class="{ 'bg-blue-200 dark:bg-blue-400': playBackOptions.isRoundTrip }"
    >
      <font-awesome-icon :icon="faArrowRight" />
      <font-awesome-icon :icon="faArrowLeft" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { playBackOptions } from "../GlobalState";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

defineProps<{
  audioIsPlaying: boolean;
}>();

</script>

<style scoped></style>
