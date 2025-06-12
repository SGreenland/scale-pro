<template>
  <div class="flex flex-col gap-2 justify-center w-64 pb-2">
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
        class="w-full h-2 bg-gradient-to-r from-[#ffca6b] to-orange-700 rounded-full outline-none appearance-none"
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
  width: 25px;
  height: 25px;
  background: #1a1a1a;
  cursor: pointer;
  /* box-shadow: 0 1px 2px #1a1a1a; */
  border-radius: 5px;
}
</style>
