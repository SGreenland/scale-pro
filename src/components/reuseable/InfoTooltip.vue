<template>
  <div class="relative">
    <FontAwesomeIcon
       @mouseover="showTooltip = true"
      @mouseleave="showTooltip = false"
      :icon="faInfoCircle"
      class="text-indigo-950 ps-1 lg:text-lg text-md dark:text-white"
    />
    <div
      v-if="showTooltip"
      class="absolute top-6 w-48 bg-white border border-black dark:bg-gray-700 dark:text-white text-sm p-2 rounded shadow-lg z-[100]"
    >
      <p class="text-sm">
        <slot></slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const showTooltip = ref(false);


</script>
