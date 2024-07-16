<script setup lang="ts">
import { ref } from "vue";
import CONFIG from "../config.js"

withDefaults(
  defineProps<{
    labels?: string[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

console.log(CONFIG)
const model = defineModel<string>();
const minBPM = ref(CONFIG.MIN_BPM);
const maxBPM = ref(CONFIG.MAX_BPM);
let xPosition = ref(false);

const calcXPosition = () => {
  const notches = maxBPM.value - minBPM.value;

  console.log({notches},  Number(model.value))

  xPosition.value = Number(model.value) / notches * 100;

 console.log(xPosition.value)
 
};

calcXPosition()
const handleBPMChange = (e) => {
  console.log({e})
  calcXPosition()
}
</script>

<script lang="ts">
</script>

<template>
  <div class="w-full max-w-3xl flex flex-col gap-2 justify-center pb-2 px-6">
    <div class="relative">
      
      <div v-if="labels?.length" class="relative w-full flex justify-between">
        <span>{{ labels[0] }}</span>
        <span>{{ labels[1] }}</span>{{xPosition.value}}
      </div>
      <input
        type="range"
        :disabled="disabled"
        :min="minBPM"
        :max="maxBPM"
        v-model="model"
        class="w-full relative z-20 h-2 bg-gray-200 rounded-full outline-none appearance-none"
        @input="handleBPMChange"
      />
      
      <div class="absolute w-full top-20 h-8 overflow-hidden">
        <div
          class="h-9 bg-gradient-to-r from-stone-900 via-transparent w-full to-stone-900 absolute left-0 bottom-0 z-10"
        ></div>
        <div
          class="w-[100%] h-8 -left-1/2"
          :style="{ transform: `translateX(${    xPosition}%)` }"
        >
        
          <div
            v-for="n in 300"
            :key="n"
            class="absolute bottom-0 h-6 bg-slate-200 w-px"
            :class="{ 'bg-red-600 h-8': n === 150 }"
            :style="{ left: n + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #60a5fa;
  cursor: pointer;
  border-radius: 50%;
}
</style>
