<template>
  <div class="w-64 flex flex-col gap-4 m-auto">
    <div class="flex w-full justify-between items-baseline m-auto">
      <div class="flex flex-col gap-1 justify-evenly items-center">
        <div
          @click="mode === 'practice' ? playBackOptions.shouldLoop = !playBackOptions.shouldLoop : null"
          role="button"
          class="flex center-xy py-1 px-2 size-10 rounded-lg border-2 border-teal-300"
          :class="{ 'bg-teal-200 dark:bg-teal-400': playBackOptions.shouldLoop, 'bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed' : mode === 'workout' }"
        >
          <font-awesome-icon :icon="faRepeat" size="lg" />
        </div>
        <span class="w-20">Repeat</span>
      </div>
      <button
        class="disabled:opacity-50 h-10 flex items-center drop-shadow-md focus:outline-none"
        :disabled="isLoadingAudio"
        :class="{ 'border-[#de9898]': audioIsPlaying }"
        @click="mode === 'practice' ? $emit('toggleAudio') : $emit('toggleWorkout')"
      >
        <font-awesome-icon :icon="audioIsPlaying ? faStop : faPlay" />
      </button>
      <div class="flex flex-col gap-1 justify-evenly items-center">
        <div
          @click="playBackOptions.isRoundTrip = !playBackOptions.isRoundTrip"
          class="flex center-xy flex-col py-1 px-2 size-10 rounded-lg cursor-pointer border-2 border-teal-300"
          :class="{ 'bg-teal-200 dark:bg-teal-400': playBackOptions.isRoundTrip }"
        >
          <font-awesome-icon :icon="faArrowsLeftRight" />
        </div>
        <span class="w-20">Round Trip</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faArrowsLeftRight, faPlay, faRepeat, faStop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { isLoadingAudio, playBackOptions } from "../GlobalState";

defineProps<{
  audioIsPlaying: boolean;
  mode: string;
}>();

</script>

<style scoped></style>
