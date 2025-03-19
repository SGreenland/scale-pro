<template>
  <div id="dropdown-btn" ref="dropdown" width="full">
    <button
      @click="open = !open"
      class="flex relative w-full items-center justify-center"
    >
      <span class="px-2">{{ buttonText }}</span>
      <FontAwesomeIcon class="absolute right-3" :class="{ 'rotate-180': open }" :icon="faChevronDown" />
      <div class="absolute top-full mt-2 right-0 p-1 z-50 bg-white rounded-xl shadow" v-show="open">
        <slot />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ref } from "vue";

const open = ref(false);

document.addEventListener("click", (e: MouseEvent) => {
  if (!e.target?.closest("#dropdown-btn")) {
    open.value = false;
  }
});

defineProps<{
  buttonText: string;
}>();
</script>

<style scoped></style>
