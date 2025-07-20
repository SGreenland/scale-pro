<template>
  <div
    class="flex-col h-screen p-4 lg:w-1/2 w-full mt-4 m-auto rounded border shadow"
  >
    <div class="w-full text-start">
      <div class="flex relative items-center py-4 border-b">
        <font-awesome-icon
          role="button"
          @click="goBack"
          class="cursor-pointer ps-1"
          :icon="faArrowLeft"
        ></font-awesome-icon>
        <h2 class="text-2xl absolute w-fit left-0 right-0 m-auto">Settings</h2>
      </div>
      <accordion-single
        title="Display"
        :extra-summary-classes="sectionHeaderClasses"
        >
        <div class="grid gap-2 mx-2 mb-2">
          <div class="flex justify-between items-center mt-2">
            <label for="theme">Theme</label>
            <select
              v-model="settings.theme"
              name="theme"
              id="theme"
              class="w-fit px-1 h-[42px]"
            >
              <option value="auto">Auto</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

      </accordion-single>

      <accordion-single
        title="Looping"
        :extra-summary-classes="sectionHeaderClasses"
      >
        <div class="flex justify-between items-center p-2">
          <label class="me-1" for="loop-gap">Loop Gap </label>
          <div class="flex items-center gap-2">
            <select
              v-model="settings.loopGap"
              name="loop-gap"
              id="loop-gap"
              class="w-fit px-1 h-[42px]"
            >
              <option
                v-for="option in LoopGapOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <NumberInput
              v-if="settings.loopGap === 'Custom'"
              v-model="settings.loopGapCustom"
              :min="1"
              :max="8"
            />
          </div>
        </div>
        <hr />
        <div class="flex w-full justify-between items-center p-2">
          <label for="auto-shuffle">Auto Shuffle </label>
          <toggle-switch
            id="auto-shuffle"
            v-model="settings.autoShuffle"
          ></toggle-switch>
        </div>
      </accordion-single>
      <!--pitch settings-->
      <accordion-single
        title="Pitch Tracking"
        :extra-summary-classes="sectionHeaderClasses"
      >
        <div>
          <div class="grid gap-2 mx-2 mb-2">
            <label for="minDetectionVolume">Volume Detection</label>
            <div class="flex items-center">
              <div class="flex w-1/3 items-center gap-2">
                <input
                  type="radio"
                  v-model="settings.minDetectionVolume"
                  value="sensitive"
                />
                Sensitive
              </div>
              <div class="flex w-1/3 items-center gap-2">
                <input
                  type="radio"
                  v-model="settings.minDetectionVolume"
                  value="normal"
                />
                Normal
              </div>
            </div>
          </div>
          <hr />
          <div class="grid gap-2 mx-2 mb-2">
            <label>Pitch Tolerance</label>
            <div class="flex justify-between items-center mx-2">
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="settings.pitchToleranceLevel"
                  value="loose"
                />
                🎵 Loose
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="settings.pitchToleranceLevel"
                  value="standard"
                />
                🎶 Standard
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="settings.pitchToleranceLevel"
                  value="precise"
                />
                🎼 Precise
              </div>
            </div>
          </div>
        </div>
      </accordion-single>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { settings } from "../GlobalState";
import { LoopGapOption } from "../types";
import AccordionSingle from "./reuseable/AccordionSingle.vue";
import NumberInput from "./reuseable/NumberInput.vue";
import ToggleSwitch from "./reuseable/ToggleSwitch.vue";

const sectionHeaderClasses: string = `bg-gradient-to-r from-sky-100 to-indigo-300 dark:from-sky-400/50 dark:to-indigo-600/50`;
const LoopGapOptions: LoopGapOption[] = ["Auto", "None", "Custom"];
function goBack() {
  window.history.back();
}
</script>

<style>
label {
  padding-top: 0;
}

input {
  height: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  hr {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
