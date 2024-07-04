<template>
  <div class="flex w-fit items-center m-auto gap-4">
    <div
      @click="shouldLoop = !shouldLoop"
      class="flex center-xy py-1 px-2 size-10 rounded-lg cursor-pointer"
      :class="{ 'border-2 border-blue-300': shouldLoop }"
    >
      <font-awesome-icon :icon="faRepeat" size="lg" />
    </div>
    <button
      class="disabled:opacity-50 h-10 flex items-center"
      :disabled="notesAreLoading"
      @click="$emit('toggleAudio', isForwardsAndBackwards, shouldLoop)"
    >
      <font-awesome-icon
        v-if="notesAreLoading"
        :icon="faSpinner"
        class="animate-spin"
      />
      <font-awesome-icon v-else :icon="audioIsPlaying ? faStop : faPlay" />
    </button>
    <div
      @click="isForwardsAndBackwards = !isForwardsAndBackwards"
      class="flex center-xy flex-col py-1 px-2 size-10 rounded-lg cursor-pointer"
      :class="{ 'border-2 border-blue-300': isForwardsAndBackwards }"
    >
      <font-awesome-icon :icon="faArrowRight" />
      <font-awesome-icon :icon="faArrowLeft" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

defineProps<{
  notesAreLoading: boolean;
  audioIsPlaying: boolean;
}>();

const isForwardsAndBackwards = ref(true);
const shouldLoop = ref(false);
</script>

<style scoped></style>
