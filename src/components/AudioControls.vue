<template>
  <div class="flex w-fit items-center m-auto gap-4">
    <div
      @click="shouldLoop = !shouldLoop"
      class="flex flex-col center-xy  w-20 text-lg px-2 size-10 rounded-lg cursor-pointer "
      :class="{ 'text-green-300' : shouldLoop }"
    >
      <font-awesome-icon class="mb-1.5" :icon="faRepeat" size="md" />
      <span class="text-sm">Repeat</span>
    </div>
    <button
      class="disabled:opacity-50 h-16 text-3xl w-16 p-0 justify-center flex flex-col items-center focus:outline-none rounded-full "
      :class="{ 'bg-red-200 dark:bg-red-500': audioIsPlaying }"
      @click="$emit('toggleAudio', isForwardsAndBackwards, shouldLoop)"
    >
      <font-awesome-icon class="ml-0.5" :icon="audioIsPlaying ? faStop : faPlay" />
    </button>
    <div
      @click="isForwardsAndBackwards = !isForwardsAndBackwards"
      class="flex flex-col center-xy  w-20 text-xl px-2 size-10 rounded-lg cursor-pointer "
      :class="{ 'text-green-300': isForwardsAndBackwards }"
    >
      <font-awesome-icon  class="mb-1.5" :icon="faArrowsLeftRight"  size="md"  />
      <span class="text-sm">Roundtrip</span>
     </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

defineProps<{
  audioIsPlaying: boolean;
}>();

const isForwardsAndBackwards = ref(true);
const shouldLoop = ref(false);
</script>

<style scoped></style>
