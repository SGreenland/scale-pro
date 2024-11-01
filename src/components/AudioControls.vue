<template>
  <div class="flex w-fit items-center m-auto gap-4">
    <div
      @click="mode === 'practice' ? playBackOptions.shouldLoop = !playBackOptions.shouldLoop : null"
      role="button"
      class="flex center-xy py-1 px-2 size-10 rounded-lg border-2 border-cyan-300"
      :class="{ 'bg-cyan-200 dark:bg-cyan-400': playBackOptions.shouldLoop, 'bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed' : mode === 'workout' }"
    >
      <font-awesome-icon :icon="faRepeat" size="lg" />
    </div>
    <button
      class="disabled:opacity-50 h-10 flex items-center focus:outline-none"
      :class="{ 'bg-red-200 dark:bg-red-500': audioIsPlaying }"
      @click="mode === 'practice' ? $emit('toggleAudio') : $emit('toggleWorkout')"
    >
      <font-awesome-icon :icon="audioIsPlaying ? faStop : faPlay" />
    </button>
    <div
      @click="playBackOptions.isRoundTrip = !playBackOptions.isRoundTrip"
      class="flex center-xy flex-col py-1 px-2 size-10 rounded-lg cursor-pointer border-2 border-cyan-300"
      :class="{ 'bg-cyan-200 dark:bg-cyan-400': playBackOptions.isRoundTrip }"
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
  mode: string;
}>();

</script>

<style scoped></style>
