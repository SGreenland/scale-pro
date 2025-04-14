<template>
  <div class="w-64 flex flex-col gap-4 m-auto">
    <div class="flex w-fit items-center m-auto gap-3">
      <div
        @click="mode === 'practice' ? playBackOptions.shouldLoop = !playBackOptions.shouldLoop : null"
        role="button"
        class="flex center-xy py-1 px-2 size-10 rounded-lg border-2 border-cyan-300"
        :class="{ 'bg-cyan-200 dark:bg-cyan-400': playBackOptions.shouldLoop, 'bg-gray-200 border-gray-300 opacity-60 cursor-not-allowed' : mode === 'workout' }"
      >
        <font-awesome-icon :icon="faRepeat" size="lg" />
      </div>
      <button
        class="disabled:opacity-50 h-10 flex items-center drop-shadow-md focus:outline-none"
        :disabled="isLoadingAudio"
        :class="{ 'border-[#de9898]': audioIsPlaying }"
        @click="mode === 'practice' ? $emit('toggleAudio') : $emit('toggleWorkout')"
      >
        <font-awesome-icon :icon="audioIsPlaying ? faStop : faPlay" />
      </button>
      <div
        @click="playBackOptions.isRoundTrip = !playBackOptions.isRoundTrip"
        class="flex center-xy flex-col py-1 px-2 size-10 rounded-lg cursor-pointer border-2 border-cyan-300"
        :class="{ 'bg-cyan-200 dark:bg-cyan-400': playBackOptions.isRoundTrip }"
      >
        <font-awesome-icon :icon="faArrowsLeftRight" />
      </div>
    </div>
    <DropdownButton
      buttonText="Settings"
      dropUp
      :close-on-click="false"
      ><template #left-icon>
        <font-awesome-icon size="lg" :icon="faCog"></font-awesome-icon>
      </template>
      <playback-settings></playback-settings>
    </DropdownButton>
  </div>
</template>

<script setup lang="ts">
import { playBackOptions, isLoadingAudio } from "../GlobalState";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowsLeftRight, faCog } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";
import DropdownButton from "./reuseable/DropdownButton.vue";
import PlaybackSettings from "./PlayBackSettings.vue";

defineProps<{
  audioIsPlaying: boolean;
  mode: string;
}>();

</script>

<style scoped></style>
