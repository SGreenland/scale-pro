<template>
  <button :disabled="isSubmitting" type="submit" class="w-full flex items-center justify-center h-12">
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

defineProps<{
  isSubmitting: boolean;
}>();
</script>

<style scoped></style>
