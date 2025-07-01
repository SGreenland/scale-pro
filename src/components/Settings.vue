<template>
  <modal-wrapper>
    <div class="text-start">
      <h2 class="text-2xl relative bottom-4">Settings</h2>
      <h3 :class="sectionHeaderClasses">Looping</h3>
      <div class="flex justify-between items-center">
        <label class="me-1" for="loop-gap">Loop Gap </label>
        <div class="flex items-center gap-2">
          <select
            v-model="loopGap"
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
            v-if="loopGap === 'Custom'"
            v-model="loopGapCustom"
            :min="1"
            :max="8"
          />
        </div>
      </div>
      <hr />
      <div class="flex w-full justify-between items-center">
        <label for="auto-shuffle">Auto Shuffle </label>
        <toggle-switch id="auto-shuffle" v-model="autoShuffle"></toggle-switch>
      </div>
      <!--pitch settings-->
      <h3 :class="sectionHeaderClasses">Pitch Tracking</h3>
      <div class="flex flex-col gap-2">
        <label for="minDetectionVolume">Volume Detection</label>
        <div class="flex items-center">
          <div class="flex w-1/3 items-center gap-2">
            <input type="radio" v-model="minDetectionVolume" value="sensitive" />
            Sensitive
          </div>
          <div class="flex w-1/3 items-center gap-2">
            <input type="radio" v-model="minDetectionVolume" value="normal" />
            Normal
          </div>
        </div>
      </div>
      <hr />
      <label class="block font-medium mb-3">Pitch Tolerance</label>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-2">
          <input type="radio" v-model="pitchToleranceLevel" value="loose" />
          🎵 Loose
        </div>
        <div class="flex items-center gap-2">
          <input type="radio" v-model="pitchToleranceLevel" value="standard" />
          🎶 Standard
        </div>
        <div class="flex items-center gap-2">
          <input type="radio" v-model="pitchToleranceLevel" value="precise" />
          🎼 Precise
        </div>
      </div>
    </div>
  </modal-wrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "./reuseable/ModalWrapper.vue";
import { LoopGapOption } from "../types";
import {
  loopGap,
  loopGapCustom,
  minDetectionVolume,
  pitchToleranceLevel,
} from "../GlobalState";
import ToggleSwitch from "./reuseable/ToggleSwitch.vue";
import { ref } from "vue";
import NumberInput from "./reuseable/NumberInput.vue";

const autoShuffle = ref(false);
const sectionHeaderClasses: string =
  "bg-gradient-to-r from-sky-100 to-indigo-300 dark:from-sky-400/50 dark:to-indigo-600/50";
const LoopGapOptions: LoopGapOption[] = ["Auto", "None", "Custom"];
</script>

<style>
label {
  padding-top: 0;
}
h3 {
  width: calc(100% + 3rem);
  margin-left: -1.5rem;
  margin-bottom: 1rem;
  padding: 0.25rem;
  text-indent: 1.5rem;
}

input {
  height: 1.5rem;
}

hr {
  width: calc(100% + 3rem);
  margin-left: -1.5rem;
  margin-block: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  hr {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
