<template>
  <div class="flex-col">
    <div
      class="grid mb-2 border-b border-gray-300 dark:border-gray-700"
      :style="{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }"
    >
      <span
        class="tab-btn dark:text-white after:dark:bg-white"
        :class="{
          'active': currentTab === tab,
          ...classObject,
        }"
        @click="tabIndex = index;"
        v-for="(tab, index) in tabs"
        :key="index"
      >
        {{ tab.replaceAll('-', ' ') }}
      </span>
    </div>
    <slot :name="currentTab"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const tabIndex = ref(0);
const currentTab = computed(() => props.tabs[tabIndex.value]);

const props = defineProps<{
  tabs: string[];
  activeColor?: string;
}>();

defineExpose({
  currentTab,
});

const classObject = computed(() => {
  return {
    "after:bg-sky-500": props.activeColor === "sky",
    "after:bg-red-500": props.activeColor === "red",
    "after:bg-green-500": props.activeColor === "green",
    "after:bg-yellow-500": props.activeColor === "yellow",
    "after:bg-purple-500": props.activeColor === "purple",
    "after:bg-pink-500": props.activeColor === "pink",
    "after:bg-indigo-600": props.activeColor === "indigo",
  };
});

</script>

<style scoped>
.tab-btn {
  position: relative;
  cursor: pointer;
  text-align: center;
  padding-bottom: 0.5rem;
  font-weight: 600;
  text-transform: capitalize;
}

.tab-btn::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 3px;
  /* background-color: #0ea5e9; */
  transform: scaleX(0);
  transition: transform 0.3s;
}

.tab-btn.active::after {
  transform: scaleX(1);
}


</style>
