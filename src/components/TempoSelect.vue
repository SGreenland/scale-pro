<template>
  <div class="flex flex-col gap-2 justify-center w-64 pb-2">
    <div>
      <div class="w-full flex justify-between">
        <span>{{ label }}</span>
        <div class="relative inline-block">
          <input
            pattern="^(40|[4-9][0-9]|1[0-9]{2}|2[0-9]{2}|300)$"
            type="text"
            v-model="model"
            size="1"
            class="text-right pr-8 bg-transparent border-b border-gray-300 dark:border-gray-600 outline-none invalid:text-red-500 me-1"
          />
          <span
            class="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm"
          >
            {{ labelSuffix }}
          </span>
        </div>
      </div>
      <input
        type="range"
        :disabled="disabled"
        :min="min"
        :max="max"
        v-model="model"
        class="w-full h-2 bg-gradient-to-r from-[#ffca6b] to-orange-700 rounded-full outline-none appearance-none"
      />
      <!-- error message if tempo selection invalid-->
      <div v-if="isInvalidTempo" class="text-red-500 text-sm pt-1">
        Tempo must be between {{ min }} and {{ max }}.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    label: string;
    labelSuffix?: string;
    disabled?: boolean;
    min: number;
    max: number;
  }>(),
  {
    disabled: false,
  }
);

const isInvalidTempo = computed(() => {
  const value = parseInt(model.value!, 10);
  return isNaN(value) || value < props.min || value > props.max;
});

const model = defineModel<string>();

defineExpose({
  isInvalidTempo,
});
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 25px;
  height: 25px;
  background: #1a1a1a;
  cursor: pointer;
  /* box-shadow: 0 1px 2px #1a1a1a; */
  border-radius: 5px;
}
</style>
