<template>
  <div class="flex-col">
    <div
      class="grid mb-3 border-b-2 border-gray-300 dark:border-gray-700"
      :style="{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }"
    >
      <span
        class="tab-btn dark:text-white"
        :class="{
          'active': currentTab === tab,
        }"
        @click="tabIndex = index;"
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
  position: relative;
  cursor: pointer;
  text-align: center;
  padding: 1rem;
  font-size: 1.5rem;
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
  background-color: #0891b2;
  transform: scaleX(0);
  transition: transform 0.3s;
}

.tab-btn.active::after {
  transform: scaleX(1);
}


</style>
