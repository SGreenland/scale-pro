<template>
    <div class="flex flex-col gap-2 p-2">
        <div class="flex justify-between items-center">
          <label class="me-1" for="loop-gap">Loop Gap </label>
          <select v-model="loopGap" name="" id="loop-gap" class="w-fit px-1 h-10">
            <option v-for="option in LoopGapOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <input :disabled="loopGap !== 'Custom'" type="number" v-model="loopGapCustom" class="text-center border size-10 rounded-lg" min="1" max="8" />
        </div>
        <div class="flex w-full justify-between items-center">
          <label for="auto-shuffle">Auto Shuffle </label>
          <toggle-switch id="auto-shuffle" v-model="autoShuffle"></toggle-switch>
        </div>
      </div>
</template>

<script setup lang="ts">
import ToggleSwitch from "./reuseable/ToggleSwitch.vue";
import { LoopGapOption } from "../types";
import { loopGap, loopGapCustom, autoShuffle } from "../GlobalState";

const LoopGapOptions: LoopGapOption[] = ['Auto', 'None', 'Custom'];

</script>