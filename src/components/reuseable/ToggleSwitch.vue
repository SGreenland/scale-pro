<template>
  <div>
    <input type="checkbox" id="toggle" class="hidden" v-model="model" />
    <label for="toggle" class="flex items-center cursor-pointer">
      <div class="flex gap-2 items-center">
        <div class="relative">
          <div
            class="block w-14 h-8 rounded-full"
            :class="{
              'bg-gray-300 dark:bg-gray-500': !model,
              'bg-indigo-900': model,
            }"
          ></div>
          <div
            class="dot absolute top-1 w-6 h-6 rounded-full transition right-1"
            :class="{
              'left-1 bg-gray-100 dark:bg-gray-300': !model,
              'bg-yellow': model,
            }"
          ></div>
        </div>
        <div v-if="showOnOffText">{{ model ? onOffText[0] : onOffText[1] }}</div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showOnOffText?: boolean;
    onOffText?: [string, string];
  }>(),
  {
    showOnOffText: true,
    onOffText: () => ["On", "Off"] as [string, string],
  }
);

const model = defineModel<boolean>();
</script>
