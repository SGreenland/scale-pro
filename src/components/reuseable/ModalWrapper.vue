<template>
  <div
    class="fixed inset-0 flex items-center justify-center"
    :class="{'bg-black bg-opacity-50 z-[1000]': mask, 'z-2': !mask}"
  >
    <div
      class="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg text-center w-[90%] max-w-md"
    >
      <FontAwesomeIcon
        role="button"
        @click="$emit('close')"
        :icon="faXmark"
        size="xl"
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
      ></FontAwesomeIcon>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineEmits } from "vue";

const props = withDefaults(defineProps<{
  mask?: boolean;
}>(), {
  mask: true,
});

defineEmits<{
  (e: "close"): void;
}>();
</script>
