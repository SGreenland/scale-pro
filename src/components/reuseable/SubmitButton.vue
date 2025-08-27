<template>
  <button :disabled="isSubmitting" type="submit" class="flex items-center justify-center h-12" :class="widthClass">
    <font-awesome-icon
      class="animate-spin"
      v-if="isSubmitting"
      :icon="faSpinner"
    ></font-awesome-icon>
    <span v-else><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

withDefaults(defineProps<{
  isSubmitting: boolean;
  widthClass?: string;
}>(), {
  isSubmitting: false,
  widthClass: "w-full"
});
</script>

<style scoped></style>
