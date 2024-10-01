<template>
  <Dropdown ref="dropdownMultiSelect" positionClass="relative" width="full">
    <template #trigger>
      <div class="flex items-center w-full input">
        <div class="flex flex-wrap pr-2">
          <div
            class="rounded-lg w-fit px-1 border bg-blue-300"
            v-for="selectedItem in model"
          >
            {{ selectedItem }}
          </div>
        </div>
        <FontAwesomeIcon class="absolute right-0 top-2 p-2" :class="{'rotate-180' : dropdownMultiSelect?.open}" :icon="faChevronDown" />
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
