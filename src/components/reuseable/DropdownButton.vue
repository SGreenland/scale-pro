<template>
  <Dropdown ref="dropdown" width="full">
    <template #trigger>
      <button
        class="flex relative w-full justify-center items-center"
      >
        {{ buttonText }}
        <FontAwesomeIcon class="absolute right-4" :class="{'rotate-180' : dropdown?.open}" :icon="faChevronDown" />
      </button>
    </template>
    <template #content>
      <slot />
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../reuseable/Dropdown.vue";
import { ref } from "vue";

const dropdown = ref<InstanceType<typeof Dropdown>>();

defineProps<{
    buttonText: string;
}>();
</script>

<style scoped></style>
