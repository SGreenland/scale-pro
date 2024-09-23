<template>
  <Dropdown positionClass="relative" width="full">
    <template #trigger>
      <div class="w-full input">
        <div
          class="rounded-lg border bg-blue-300"
          v-for="selectedItem in model"
        >
          {{ selectedItem }}
        </div>

      </div>
    </template>
    <template #content>
      <div class="w-full">
        <!-- <input v-model="search" class="w-full" placeholder="Search..." /> -->
        <div class="flex flex-col">
          <Checkbox
            v-for="item in items"
            :key="item"
            v-model="model"
            :value="item"
            :label="item"
          />
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import Dropdown from "./Dropdown.vue";
import Checkbox from "./Checkbox.vue";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const model = defineModel<any[]>();




</script>

<style scoped></style>
