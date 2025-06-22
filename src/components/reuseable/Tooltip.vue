<template>
  <div
    v-if="isVisible"
    class="absolute top-8 w-48 bg-white border dark:bg-gray-700 dark:text-white text-sm p-2 rounded shadow-lg z-[100]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import type { ComponentPublicInstance } from 'vue';



const props = defineProps<{
  trigger: ComponentPublicInstance | null;
}>();

const isVisible = ref(false);

onMounted(() => {
  nextTick(() => {
    if (props.trigger) {

      props.trigger!.$el.addEventListener('mouseenter', () => {
        isVisible.value = true;
      });
      props.trigger!.$el.addEventListener('mouseleave', () => {
        isVisible.value = false;
      });
    }
  });
});


</script>
