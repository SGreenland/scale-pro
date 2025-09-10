<template>
  <card-wrapper title="Settings" :withBackArrow="true">
    <div class="w-full text-start">
      <accordion-single
        title="General"
        :extra-summary-classes="sectionHeaderClasses"
      >
        <div :class="optionInlineClasses">
          <label for="startingNote">Starting Note</label>
          <root-note-selector
            v-model="currentSettings.startingRootNote"
          ></root-note-selector>
        </div>
        <div :class="optionInlineClasses" class="border-b-0">
          <label for="startingScale">Starting Scale</label>
          <select
            v-model="currentSettings.startingScale"
            name="startingScale"
            id="startingScale"
          >
            <option v-for="scale in Object.keys(scales)" :value="scale">
              {{ scale }}
            </option>
          </select>
        </div>
      </accordion-single>
      <accordion-single
        title="Display"
        :extra-summary-classes="sectionHeaderClasses"
      >
        <div :class="optionInlineClasses">
          <label for="theme">Theme</label>
          <select
            v-model="currentSettings.theme"
            name="theme"
            id="theme"
            class="w-fit px-1 h-[42px]"
          >
            <option value="auto">Auto</option>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>
        <div :class="optionInlineClasses" class="border-b-0">
          <label for="grid-type">Grid Type</label>
          <custom-radio-chips
            id="grid-type"
            :options="['Guitar tab', 'Piano roll']"
            v-model="currentSettings.gridType"
          ></custom-radio-chips>
        </div>
      </accordion-single>

      <accordion-single
        title="Looping"
        :extra-summary-classes="sectionHeaderClasses"
      >
        <div :class="optionInlineClasses">
          <label class="me-1" for="loop-gap">Loop Gap </label>
          <div class="flex items-center gap-2">
            <select
              v-model="currentSettings.loopGap"
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
              v-if="currentSettings.loopGap === 'Custom'"
              v-model="currentSettings.loopGapCustom"
              :min="1"
              :max="8"
            />
          </div>
        </div>
        <div :class="optionInlineClasses" class="border-b-0">
          <label for="auto-shuffle">Auto Shuffle </label>
          <toggle-switch
            id="auto-shuffle"
            v-model="currentSettings.autoShuffle"
          ></toggle-switch>
        </div>
      </accordion-single>
      <!--pitch settings-->
      <accordion-single
        ref="pitchTrackingAccordion"
        title="Pitch Tracking"
        :extra-summary-classes="sectionHeaderClasses"
      >
        <div>
          <div :class="optionClasses">
            <label for="minDetectionVolume">Volume Detection</label>
            <div class="flex items-center">
              <div class="flex w-1/3 items-center gap-2">
                <input
                  type="radio"
                  v-model="currentSettings.minDetectionVolume"
                  value="sensitive"
                />
                Sensitive
              </div>
              <div class="flex w-1/3 items-center gap-2">
                <input
                  type="radio"
                  v-model="currentSettings.minDetectionVolume"
                  value="normal"
                />
                Normal
              </div>
            </div>
          </div>
          <div :class="optionClasses" class="border-b-0">
            <label>Pitch Tolerance</label>
            <div class="flex justify-between items-center mx-2">
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="currentSettings.pitchToleranceLevel"
                  value="loose"
                />
                🎵 Loose
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="currentSettings.pitchToleranceLevel"
                  value="standard"
                />
                🎶 Standard
              </div>
              <div class="flex items-center gap-2">
                <input
                  type="radio"
                  v-model="currentSettings.pitchToleranceLevel"
                  value="precise"
                />
                🎼 Precise
              </div>
            </div>
          </div>
        </div>
      </accordion-single>
    </div>
    <submit-button
      v-if="currentLoggedInUser?.hasPremiumAccess"
      class="mt-4"
      @click="saveSettings"
      :isSubmitting="isSaving"
      >{{ getButtonText() }}
    </submit-button>
  </card-wrapper>
</template>

<script setup lang="ts">
import { LoopGapOption } from "@scalemaestro/shared-types";
import { ref, onMounted } from "vue";
import { currentLoggedInUser, currentSettings } from "../GlobalState";
import { scales } from "../NotesAndScales";
import AccordionSingle from "./reuseable/AccordionSingle.vue";
import CardWrapper from "./reuseable/CardWrapper.vue";
import CustomRadioChips from "./reuseable/CustomRadioChips.vue";
import NumberInput from "./reuseable/NumberInput.vue";
import SubmitButton from "./reuseable/SubmitButton.vue";
import ToggleSwitch from "./reuseable/ToggleSwitch.vue";
import RootNoteSelector from "./RootNoteSelector.vue";
import axios from "axios";

const isSaving = ref(false);
const successfullySaved = ref(false);
const sectionHeaderClasses: string = `bg-gradient-to-r from-sky-100 to-indigo-300 dark:from-sky-400/50 dark:to-indigo-600/50 shadow-indigo-400 rounded mb-1`;
const optionInlineClasses: string =
  "flex flex-wrap items-center justify-between py-3 px-2 border-b";
const optionClasses: string = "grid gap-2 p-3 border-b";
const LoopGapOptions: LoopGapOption[] = ["Auto", "None", "Custom"];
const pitchTrackingAccordion = ref<InstanceType<typeof AccordionSingle> | null>(
  null
);

onMounted(() => {
  const queryParams = new URLSearchParams(window.location.search);

  if (
    queryParams.get("section") === "pitch-tracking" &&
    pitchTrackingAccordion.value
  ) {
    const accordionElement = pitchTrackingAccordion.value?.$el as HTMLElement;
    if (accordionElement) {
      accordionElement.setAttribute("open", "true");
      accordionElement.scrollIntoView({ behavior: "smooth" });
    }
  }
});

function getButtonText() {
  return successfullySaved.value ? "Settings Saved!" : "Save Settings";
}

async function saveSettings() {
  isSaving.value = true;
  try {
    const response = await axios.post(
      "/api/settings",
      { settings: currentSettings.value }
    );

    if (response.data.settings) {
      currentLoggedInUser.value!.userSettings = response.data.settings;
    }
    isSaving.value = false;
    successfullySaved.value = true;
    setTimeout(() => {
      successfullySaved.value = false;
    }, 3000);
  } catch (error: any) {
    isSaving.value = false;
    alert(
      "Error saving settings: " +
        (error.response?.data?.message || error.message || error)
    );
  }
}
</script>

<style>
label {
  padding-top: 0;
}

input {
  height: 1.5rem;
}

hr {
  margin-block: 0.75rem;
}

@media (prefers-color-scheme: dark) {
  hr {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
