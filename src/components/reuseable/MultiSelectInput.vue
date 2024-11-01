<template>
  <Dropdown ref="dropdownMultiSelect" width="full">
    <template #trigger>
      <div class="flex items-center w-full input">
        <div class="grid w-full grid-cols-4 gap-1">
          <div
            class="relative flex justify-between rounded-lg w-full px-2 bg-cyan-300 text-black max-sm:text-sm"
            v-for="selectedItem in model?.filter((_, index) => index <= 2)"
          >
            <span class="truncate">{{ selectedItem }}</span>
            <span role="button" @click.prevent.stop="model.length > 1 && model?.splice(model?.findIndex((item) => item === selectedItem), 1)">
              <font-awesome-icon :icon="faXmark" size="sm"></font-awesome-icon>
            </span>
          </div>

          <div class="w-full px-1 truncate" v-if="model!.length > 3">
            +{{ model!.length - 3 }} more
          </div>
        </div>
        <FontAwesomeIcon
          class="absolute right-0 top-2 p-2 size-3"
          :class="{ 'rotate-180': dropdownMultiSelect?.open }"
          :icon="faChevronDown"
        />
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
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
