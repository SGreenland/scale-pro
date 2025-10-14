<template>
  <div class="flex gap-1">
    <label class="capitalize" v-if="showLabel" for="note-pattern">{{
      selectedPatternCategory + "s"
    }}</label>
    <info-tooltip :alignLeft="alignTooltipLeft">
      Click the three vertical dots to select different categories of patterns
      (scales, arpeggios, intervals). To gain access to more patterns
      <a href="/signup">sign up</a> to a premium account. Some patterns are
      locked and can be unlocked by achieving certain milestones in the app!
    </info-tooltip>
  </div>
  <div class="flex w-full gap-2">
    <select class="grow" id="note-pattern" v-model="model">
      <option
        :value="pattern"
        :disabled="pattern.isLocked && isLockedForUser(pattern.id)"
        v-for="(pattern, index) in getPatternOptions"
        :key="index"
      >
        {{ pattern.name }}
        <font-awesome-icon
          v-if="pattern.isLocked && isLockedForUser(pattern.id)"
          :icon="faLock"
          class="text-end"
        />
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
              'active-select bg-indigo-500 text-white':
                selectedPatternCategoryRef === category,
              'hover:bg-indigo-200 dark:hover:bg-indigo-600':
                selectedPatternCategoryRef !== category,
            }"
            class="capitalize rounded-md px-2 py-1 text-left"
          >
            {{ category + "s" }}
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
import { computed, ref, watch } from "vue";
import {
  availablePatterns,
  currentSettings,
  scaleConfig,
  selectedPatternCategory,
  userUnlockedPatterns,
} from "../GlobalState";
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

const selectedPatternCategoryRef = isSettingsPage
  ? ref(currentSettings.value?.startingPattern.type || "scale")
  : selectedPatternCategory;

const getPatternOptions = computed(() => {
  return availablePatterns.value?.filter(
    (pattern) => pattern.type === selectedPatternCategoryRef.value
  );
});

function isLockedForUser(patternId: number) {
  return !userUnlockedPatterns.value.some((id) => id === patternId);
}

watch(
  () => getPatternOptions.value,
  (newPatterns) => {
    if (
      !newPatterns.some(
        (pattern) => pattern.name === scaleConfig.selectedPattern.name
      )
    ) {
      console.log("Pattern not found, defaulting to:", newPatterns[0]);
      model.value = newPatterns[0];
    }
    // else model.value = availablePatterns.value.find(pattern => pattern.name === scaleConfig.selectedPattern.name);
  }
);
</script>
