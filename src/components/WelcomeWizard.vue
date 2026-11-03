<template>
  <ModalWrapper v-if="shouldShowWizard" @close="closeModal">
    <div class="w-full p-2 pb-0 m-auto h-[320px] flex flex-col justify-between">
      <div class="h-[200px] relative">
        <div class="flex flex-col h-full justify-between" v-if="!currentStep">
          <div>
            <h2 class="text-lg font-semibold mb-3">Setup Wizard</h2>
            <p class="mb-4">
              It looks like this is your first time visiting Scale Maestro!
            </p>
            <p class="mb-4">
              To get you started, we've put together a quick setup wizard to
              help you configure your settings and get familiar with the app.
            </p>
          </div>
        </div>
        <Transition class="absolute w-[95%] m-auto h-[200px]" v-else>
          <component :is="currentStepComponent" class="mt-4" />
        </Transition>
      </div>
      <div v-if="currentStep" class="flex gap-2 justify-end mt-4">
        <button v-if="currentStep > 1" @click="prevStep" class="inverted-btn flex items-center h-8">
          Back
        </button>
        <button v-if="currentStep > 0 && currentStep < 5" @click="nextStep" :disabled="disableNext" class="flex items-center h-8">
          Next
        </button>
        <button v-if="currentStep === 5" @click="closeModal" class="flex items-center h-8">
          Finish
        </button>
      </div>
      <div v-else class="flex gap-2 justify-end">
        <button @click="closeModal" class="inverted-btn">Dismiss</button>
        <button @click="runWizard">Get started</button>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "./reuseable/ModalWrapper.vue";
import { ref, onMounted, defineAsyncComponent, computed, watch } from "vue";
import useSetupWizard from "../composables/useSetupWizard";

const { shouldShowWizard, currentStep, nextStep, prevStep, checkFirstVisit, disableNext } =
  useSetupWizard();
const currentStepComponent = computed(() => {
  const stepComponent = [
    defineAsyncComponent(() => import("./wizardSteps/WizardStep1.vue")),
    defineAsyncComponent(() => import("./wizardSteps/WizardStep2.vue")),
    defineAsyncComponent(() => import("./wizardSteps/WizardStep3.vue")),
    defineAsyncComponent(() => import("./wizardSteps/WizardStep4.vue")),
    defineAsyncComponent(() => import("./wizardSteps/WizardStep5.vue")),
  ];

  return stepComponent[currentStep.value - 1] || null;
});

onMounted(() => {
  checkFirstVisit();
});

function closeModal() {
  shouldShowWizard.value = false;
}

function runWizard() {
  currentStep.value = 1; // Start the wizard at step 1
}
</script>

<style scoped>
.v-enter-from,
.v-leave-to {
  opacity: 0;
  /* transform: translateX(100%); */
}
.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
  /* transform: translateX(0); */
}
</style>
