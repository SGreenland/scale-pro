<template>
  <Dropdown ref="dropdownMultiSelect" width="full">
    <template #trigger>
      <div class="flex items-center w-full input" :class="{ 'max-md:overflow-auto' : model!.length > 1}">
        <div class="flex flex-wrap pr-2">
          <div
            class="rounded-lg w-fit px-1 border bg-blue-300"
            v-for="selectedItem in model"
          >
            {{ selectedItem }}
          </div>
        </div>
        <FontAwesomeIcon class="absolute right-0 top-2 p-2 size-3" :class="{'rotate-180' : dropdownMultiSelect?.open, 'max-md:right-4' : model!.length > 1 }" :icon="faChevronDown" />
      </div>
    </template>
    <template #content>
      <div class="w-full p-2">
        <!-- <input v-model="search" class="w-full" placeholder="Search..." /> -->
        <div class="flex flex-col">
          <Checkbox
            v-for="item in items"
            :key="item"
            :disabled="model?.length === 1 && model[0] === item"
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { ref } from "vue";

const dropdownMultiSelect = ref<InstanceType<typeof Dropdown>>();

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const model = defineModel<any[]>();




</script>

<style scoped></style>
