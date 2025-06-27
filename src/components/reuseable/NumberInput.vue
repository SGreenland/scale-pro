<template>
  <div class="flex h-[42px]">
    <input
      type="number"
      v-model="model"
      :min="min ?? 0"
      :max="max ?? 100"
      :step="step"
    />
    <!-- up down buttons-->
    <div class="grid h-full grid-rows-2">
      <button
        @click="model = parseFloat(Math.min(max, model + step).toFixed(1))"
        class="p-1 hover:bg-gray-300 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-none rounded-tr-lg flex items-center justify-center border border-black dark:border-gray-600"
      >
        +
      </button>
      <button
        @click="model = parseFloat(Math.max(min, model - step).toFixed(1))"
        class="p-1 hover:bg-gray-300 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-none rounded-br-lg flex items-center justify-center border border-t-0 border-black dark:border-gray-600"
      >
        -
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: number;
    min: number;
    max: number;
    step?: number;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
  }
);
const model = defineModel<number>({
  default: 0.5,
  type: Number,
});
</script>

<style scoped>

input[type="number"] {
  border-right: none;
  border-radius: 8px 0 0 8px;
}

button:hover {
  outline: 2px solid transparent !important;
}
</style>
