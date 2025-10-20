<template>
  <div class="relative size-fit p-0">
    <FontAwesomeIcon
       @mouseover="showTooltip = true"
      @mouseleave="handleMouseLeave($event)"
      :icon="faInfoCircle"
      class="text-indigo-950 lg:text-lg text-md dark:text-white"
    />
    <div
      v-if="showTooltip"
      @mouseleave="showTooltip = false"
      class="tooltip absolute top-5 w-48 max-w-[40vw] bg-white border border-black dark:bg-gray-700 dark:text-white text-sm p-2 rounded shadow-lg z-[10000]"
      :class="alignLeft && 'left-[-12rem]'"
    >
      <p class="text-sm">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

defineProps<{
  alignLeft?: boolean;
}>();

const showTooltip = ref(false);

const handleMouseLeave = (event: MouseEvent) => {
  const toElement = event.relatedTarget as HTMLElement | null;
  if (toElement && toElement.closest(".tooltip")) {
    // If the mouse is moving to the tooltip, do nothing
    return;
  }
  showTooltip.value = false;
};


</script>
