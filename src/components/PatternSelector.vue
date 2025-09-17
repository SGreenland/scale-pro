<template>
    <label v-if="showLabel" for="note-pattern">{{ selectedPatternCategory.slice(0, -1) }}</label>
    <div class="flex w-full gap-2">
      <select
        class="grow"
        id="note-pattern"
        v-model="scaleConfig.selectedPattern"
      >
        <option
          :value="pattern"
          v-for="(pattern, index) in getPatternOptions"
          :key="index"
        >
          {{ pattern.name }}
        </option>
      </select>
      <dropdown class="self-center" :closeContentOnClick="true">
        <template #trigger>
          <font-awesome-icon role="button" :icon="faEllipsisV" size="xl" />
        </template>
        <template #content>
          <div class="grid gap-2 p-2">
            <b class="border-b">Choose Category: </b>
            <button
              v-for="category in ['Scales', 'Arpeggios', 'Intervals']"
              :key="category"
              @click="selectedPatternCategory = category"
              :class="
                {
                  'bg-indigo-500 text-white':
                    selectedPatternCategory === category,
                  'hover:bg-indigo-200 dark:hover:bg-indigo-600':
                    selectedPatternCategory !== category,
                } + ' rounded-md px-2 py-1 text-left'
              "
            >
              {{ category }}
            </button>
          </div>
        </template>
      </dropdown>
    </div>
</template>

<script setup lang="ts">
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NotePattern } from "@scalemaestro/shared-types";
import { computed, ref, watch } from "vue";
import { currentLoggedInUser, scaleConfig } from "../GlobalState";
import { notePatterns } from "../NotesAndScales";
import dropdown from "./reuseable/Dropdown.vue";

withDefaults(defineProps<{
  showLabel?: boolean;
}>(),
{ showLabel: true });


const getAvailablePatternsPerUser = (): NotePattern[] => {
  return currentLoggedInUser.value?.hasPremiumAccess
    ? notePatterns
    : notePatterns.filter((pattern) => !pattern.isPremium);
};

const availablePatterns = getAvailablePatternsPerUser();
const selectedPatternCategory = ref("Scales");

const getPatternOptions = computed(() => {
  return availablePatterns.filter(
    (pattern) =>
      pattern.type === selectedPatternCategory.value.slice(0, -1).toLowerCase()
  );
});

watch(
  () => getPatternOptions.value,
  (newPatterns) => {
    if (!newPatterns.includes(scaleConfig.selectedPattern)) {
      scaleConfig.selectedPattern = newPatterns[0];
    }
  }, { immediate: true }
);
</script>
