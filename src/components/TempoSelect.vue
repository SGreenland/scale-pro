<template>
  <div class="flex flex-col gap-2 justify-center pb-2">
    <div>
      <div v-if="labels?.length" class="w-full flex justify-between">
        <span>{{ labels[0] }}</span>
        <span>{{ labels[1] }}</span>
      </div>
      <input
        type="range"
        :disabled="disabled"
        min="40"
        max="300"
        v-model="model"
        class="w-full h-2 bg-gray-200 rounded-full outline-none appearance-none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    labels?: string[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const model = defineModel<string>();
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #60a5fa;
  cursor: pointer;
  border-radius: 50%;
}
</style>
