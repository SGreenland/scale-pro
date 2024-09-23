<template>
  <div class="flex-col">
    <div
      class="grid mb-3"
      :style="{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }"
    >
      <span
        class="tab-btn"
        :class="{
          'border-b-4 border-blue-500': currentTab === tab,
          'border-b-2 border-grey-300': currentTab !== tab,
        }"
        @click="tabIndex = index"
        v-for="(tab, index) in tabs"
        :key="index"
      >
        {{ tab }}
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
}>();

defineExpose({
  currentTab,
});
</script>

<style scoped>
.tab-btn {
  cursor: pointer;
  text-align: center;
  padding: 1rem;
  font-size: 1.5rem;
  color: #333;
  text-transform: capitalize;
}
</style>
