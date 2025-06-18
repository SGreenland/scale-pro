<template>
    <div class="absolute right-6 w-72 bg-white shadow rounded z-50 flex flex-col gap-2 p-4">
        <div class="flex justify-between items-center">
          <label class="me-1" for="loop-gap">Loop Gap </label>
          <div>
            <select v-model="loopGap" name="" id="loop-gap" class="w-fit px-1 h-10 me-2">
              <option v-for="option in LoopGapOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <input v-if="loopGap === 'Custom'" type="number" v-model="loopGapCustom" class="text-center border size-10 rounded-lg" min="1" max="8" />
          </div>
        </div>
        <!-- <div class="flex w-full justify-between items-center">
          <label for="auto-shuffle">Auto Shuffle </label>
          <toggle-switch id="auto-shuffle" v-model="autoShuffle"></toggle-switch>
        </div> -->
      </div>
</template>

<script setup lang="ts">
// import ToggleSwitch from "./reuseable/ToggleSwitch.vue";
import { LoopGapOption } from "../types";
import { loopGap, loopGapCustom } from "../GlobalState";

const LoopGapOptions: LoopGapOption[] = ['Auto', 'None', 'Custom'];

</script>