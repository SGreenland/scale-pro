<template>
  <details>
    <summary class="flex justify-between items-center w-full p-2 border cursor-pointer" :class="extraSummaryClasses">
      <h3>{{ title }}</h3>
      <font-awesome-icon :icon="faChevronDown"></font-awesome-icon>
    </summary>
    <slot></slot>
  </details>
</template>

<script setup lang="ts">
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { defineProps } from "vue";
const props = defineProps<{
  title: string;
  extraSummaryClasses?: string;
}>();
</script>

<style scoped>
details[open] svg {
  transform: rotate(180deg);
}
</style>
