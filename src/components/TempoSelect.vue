<script setup lang="ts">
import { ref, onMounted } from "vue";
import CONFIG from "../config.js"
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

withDefaults(
  defineProps<{
    labels?: string[];
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

const model = defineModel<string>();
const minBPM = ref<number>(CONFIG.MIN_BPM);
const maxBPM = ref<number>(CONFIG.MAX_BPM);
const bpmRange = maxBPM.value - minBPM.value;

const rangeSliderOuter = ref<HTMLElement>();
const rangeSliderInner = ref<HTMLElement>();

const convertPercentageToModal = (percentage: number) => {
  model.value = Math.floor(bpmRange * (percentage / 100) + minBPM.value).toString();
}

onMounted(() => {
  const rangeSliderOuterRight = rangeSliderOuter.value?.getBoundingClientRect().right;
  const rangeSliderOuterWidth = rangeSliderOuter.value?.getBoundingClientRect().width;

  if (rangeSliderInner.value && rangeSliderOuter.value) {
    const sliderTransform = ((model.value - minBPM.value) / bpmRange - 1) * rangeSliderOuterWidth;

    console.log(rangeSliderOuterWidth, bpmRange, sliderTransform * rangeSliderOuterWidth)

    gsap.set(rangeSliderInner.value, { x: sliderTransform });

    Draggable.create(rangeSliderInner.value, {
      type: "x",
      zIndexBoost: false,
      bounds: rangeSliderOuter.value,

      onDrag: (e: PointerEvent) => {
        const rangeSliderInnerRight = rangeSliderInner.value?.getBoundingClientRect().right;
 
        const percentage = (rangeSliderInnerRight - rangeSliderOuterRight) / rangeSliderOuterWidth * 100;

        convertPercentageToModal(percentage);
      }
    });
  }
});

</script>


<template>
  <div class="w-full max-w-3xl flex flex-col gap-2 justify-center pb-2 px-6">
    <div class="relative">
      <div v-if="labels?.length" class="relative w-full flex justify-between font-bold text-sm">
        <span>{{ labels[0] }}</span>
        <span>{{ labels[1] }}</span>
      </div>
      <input type="range" :disabled="disabled" :min="minBPM" :max="maxBPM" v-model="model"
        class="w-full relative z-20 visibility hidden h-2 bg-gray-200 rounded-full outline-none appearance-none"
        @input="handleBPMChange" />

      <div ref="rangeSliderOuter" class="pointer-events-none w-full relative h-8 overflow-hidden px-px">
        <div
          class="h-9 pointer-events-none opacity-75 bg-gradient-to-r from-stone-900 via-transparent w-full to-stone-900 absolute left-0 bottom-0 z-30">
        </div>
        <div ref="rangeSliderInner"
          class="pointer-events-auto  w-[200%] z-20 relative h-8 flex flex-row items-end justify-between hover:cursor-grab">

          <div v-for="(n, i) in 201" :key="n" class="pointer-events-none relative bottom-0  "
            :class="i === 100 ? 'bg-red-600 h-8 w-[1px]' : 'w-px h-6 bg-slate-200'">
           </div>
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
