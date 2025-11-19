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
      :class="alignmentClass"
    >
      <p class="text-sm">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { onMounted, ref, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const props = withDefaults(defineProps<{
  alignment?: "left" | "right" | "center";
}>(), { alignment: "left" });

const alignmentClass = computed<{
  [key: string]: boolean;
}>(() => {
  return {
    "left-0": props.alignment === "left",
    "right-0": props.alignment === "right",
    "left-1/2 transform -translate-x-1/2": props.alignment === "center",
  };
});

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
