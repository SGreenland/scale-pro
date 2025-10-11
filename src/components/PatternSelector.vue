<template>
  <div class="flex gap-1">
    <label class="capitalize" v-if="showLabel" for="note-pattern">{{
      selectedPatternCategory + "s"
    }}</label>
    <info-tooltip :alignLeft="alignTooltipLeft">
      Click the three vertical dots to select different categories of patterns (scales, arpeggios, intervals). To gain access to more patterns <a href="/signup">sign up</a> to a premium account. Some patterns are locked and can be unlocked by achieving certain milestones in the app!
    </info-tooltip>
  </div>
  <div class="flex w-full gap-2">
    <select class="grow" id="note-pattern" v-model="model">
      <option
        :value="pattern"
        :disabled="lockedPatterns.includes(pattern.name as keyof NotePattern)"
        v-for="(pattern, index) in getPatternOptions"
        :key="index"
      >
        {{ pattern.name }} <font-awesome-icon v-if="lockedPatterns.includes(pattern.name as keyof NotePattern)" :icon="faLock"  class="text-end" />
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
            v-for="category in (['scale', 'arpeggio', 'interval'] as NotePatternCategory[])"
            :key="category"
            @click="selectedPatternCategoryRef = category"
            :class="{
              'active-select bg-indigo-500 text-white': selectedPatternCategoryRef === category,
              'hover:bg-indigo-200 dark:hover:bg-indigo-600':
                selectedPatternCategoryRef !== category,
            }"
            class="capitalize rounded-md px-2 py-1 text-left"
          >
            {{ category + 's' }}
          </button>
        </div>
      </template>
    </dropdown>
  </div>
</template>

<script setup lang="ts">
import { faEllipsisV, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { NotePattern, NotePatternCategory } from "@scalemaestro/shared-types";
import { computed, watch, ref } from "vue";
import { currentLoggedInUser, currentSettings, scaleConfig, selectedPatternCategory } from "../GlobalState";
import { notePatterns, lockedPatterns } from "../NotesAndScales";
import dropdown from "./reuseable/Dropdown.vue";
import InfoTooltip from "./reuseable/InfoTooltip.vue";

withDefaults(
  defineProps<{
    showLabel?: boolean;
    alignTooltipLeft?: boolean;
  }>(),
  { showLabel: true }
);

const model = defineModel<NotePattern>();

const isSettingsPage = window.location.pathname === "/settings";

const selectedPatternCategoryRef = isSettingsPage ? ref(currentSettings.value?.startingPattern.type || 'scale') : selectedPatternCategory;

const getAvailablePatternsPerUser = (): NotePattern[] => {
  return currentLoggedInUser.value?.hasPremiumAccess
    ? notePatterns
    : notePatterns.filter((pattern) => !pattern.isPremium);
};

const availablePatterns = getAvailablePatternsPerUser();

const getPatternOptions = computed(() => {
  return availablePatterns.filter(
    (pattern) =>
      pattern.type === selectedPatternCategoryRef.value
  );
});

watch(
  () => getPatternOptions.value,
  (newPatterns) => {
    if (!newPatterns.includes(scaleConfig.selectedPattern)) {
      model.value = newPatterns[0];
    }
  },
);
</script>
