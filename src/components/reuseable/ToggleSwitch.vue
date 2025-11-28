<template>
  <div>
    <input type="checkbox" :id=id class="hidden" v-model="model" />
    <label :for=id class="flex items-center cursor-pointer p-0">
      <div class="flex gap-2 items-center">
        <div class="relative">
          <div
            class="block w-14 h-8 rounded-full"
            :class="{
              'bg-gray-300 dark:bg-gray-500': !model,
              'bg-indigo-900 dark:shadow dark:shadow-white': model,
            }"
          >
        </div>
          <div
            class="dot center-xy absolute top-1 w-6 h-6 rounded-full transition right-1"
            :class="{
              'left-1 bg-gray-100 dark:bg-gray-300': !model,
              'bg-yellow': model,
            }"
          >
         <!--optional icon-->
          <slot name="icon"></slot>
        </div>
        </div>
        <div v-if="showOnOffText">{{ model ? onOffText[0] : onOffText[1] }}</div>
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

withDefaults(
  defineProps<{
    id?: string;
    showOnOffText?: boolean;
    onOffText?: [string, string];
  }>(),
  {
    showOnOffText: true,
    onOffText: () => ["On", "Off"] as [string, string],
    id: () => useId(),
  }
);

const model = defineModel<boolean>();
</script>
