<template>
  <modal-wrapper>
    <div class="text-start">
      <h2 class="text-2xl relative bottom-4">Settings</h2>
      <h3 class="bg-sky-100 dark:bg-sky-900">Looping</h3>
      <div class="flex justify-between">
        <label class="me-1" for="loop-gap">Loop Gap </label>
        <div class="flex items-center gap-2">
          <select v-model="loopGap" name="loop-gap" id="loop-gap" class="w-fit px-1">
            <option
              v-for="option in LoopGapOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <input
            @input="($event) => { const input = $event.target as HTMLInputElement; input.value.length > 1 && (input.value = input.value[0])}"
            v-if="loopGap === 'Custom'"
            type="number"
            v-model="loopGapCustom"
            min="1"
            max="8"
          />
        </div>
      </div>
      <hr>
      <div class="flex w-full justify-between items-center">
        <label for="auto-shuffle">Auto Shuffle </label>
        <toggle-switch id="auto-shuffle" v-model="autoShuffle"></toggle-switch>
      </div>
      <!--pitch settings-->
      <h3 class="bg-sky-100 dark:bg-sky-900">Pitch Tracking</h3>
      <div class="flex justify-between items-center">
        <label for="minDetectionVolume">Min. Detection Volume</label>
        <input
          id="minDetectionVolume"
          name="minDetectionVolume"
          type="number"
          v-model="minDetectionVolume"
          min="0"
          max="1"
          step="0.1"
        />
      </div>
      <hr>
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
import { loopGap, loopGapCustom, minDetectionVolume, pitchToleranceLevel } from "../GlobalState";
import ToggleSwitch from "./reuseable/ToggleSwitch.vue";
import { ref } from "vue";

const autoShuffle = ref(false);

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
</style>
