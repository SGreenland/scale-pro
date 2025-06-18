<template>
  <div id="dropdown-btn" ref="dropdown" width="full">
    <button
      @click="toggleContent($event)"
      class="flex relative w-full items-center justify-center"
    >
      <div class="absolute left-3">
        <slot name="left-icon" />
      </div>
      <span class="px-2">{{ buttonText }}</span>
      <FontAwesomeIcon class="absolute right-3" :class="{ 'rotate-180': open }" :icon="!dropUp ? faChevronDown : faChevronUp" />
      <div id="dropdown-content" class="absolute min-w-full right-0 p-2 z-50 bg-white dark:bg-indigo-900 rounded-xl shadow border" :class="{'bottom-full mb-2': dropUp, 'top-full mt-2' : !dropUp}" v-show="open">
        <slot />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { ref } from "vue";

const props = withDefaults(defineProps<{
  buttonText: string;
  dropUp?: boolean;
  closeOnClick?: boolean;
}>(),{
  dropUp: false,
  closeOnClick: true,
});

const open = ref(false);

function toggleContent(e: MouseEvent) {
  const triggerElement = e.target as HTMLElement;
  if(!props.closeOnClick && triggerElement?.closest("#dropdown-content")) {
    return;
  }
  open.value = !open.value;
}


document.addEventListener("click", (e: MouseEvent) => {
  const triggerElement = e.target as HTMLElement;
  if (!triggerElement?.closest("#dropdown-btn")) {
    open.value = false;
  }

});


</script>

<style scoped></style>
