<template>
  <div
    class="flex-col h-fit p-4 lg:w-1/2 w-full mt-4 m-auto rounded border shadow"
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
      <accordion-single title="General" :extra-summary-classes="sectionHeaderClasses">
        <div :class="optionClasses">
          <label for="startingNote">Starting Note</label>
          <root-note-selector v-model="settings.startingRootNote"></root-note-selector>
        </div>
        <hr />
        <div :class="optionClasses">
          <label for="startingScale">Starting Scale</label>
          <select v-model="settings.startingScale" name="startingScale" id="startingScale">
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
        <div :class="optionClasses">
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
        <hr>
        <div :class="optionClasses">
          <label for="grid-type">Grid Type</label>
          <custom-radio-chips
            id="grid-type"
            :options="['Guitar tab', 'Piano roll']"
            v-model="settings.gridType"
          ></custom-radio-chips>
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
          <div :class="optionClasses">
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
          <div :class="optionClasses">
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
    <submit-button
      v-if="currentLoggedInUser"
      class="mt-4"
      @click="saveSettings"
      :isSubmitting="isSaving"
      :buttonText="getButtonText()"
      ></submit-button>
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
import CustomRadioChips from "./reuseable/CustomRadioChips.vue";
import { scales } from "../NotesAndScales";
import RootNoteSelector from "./RootNoteSelector.vue";
import { currentLoggedInUser } from "../GlobalState";
import { ref } from "vue";
import SubmitButton from "./reuseable/SubmitButton.vue";
const isSaving = ref(false);
const successfullySaved = ref(false);

const sectionHeaderClasses: string = `bg-gradient-to-r from-sky-100 to-indigo-300 dark:from-sky-400/50 dark:to-indigo-600/50`;
const optionClasses: string = "grid gap-2 mx-2 mb-2";
const LoopGapOptions: LoopGapOption[] = ["Auto", "None", "Custom"];
function goBack() {
  window.history.back();
}

function getButtonText() {
  return successfullySaved.value ? "Settings Saved!" : "Save Settings";
}

async function saveSettings() {
  isSaving.value = true;
  try {
    const response = await fetch(`/api/settings/${currentLoggedInUser.value?.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({settings: settings}),
    });

    if (!response.ok) {
      throw new Error('Failed to save settings');
    }

    const data = await response.json();

    Object.assign(settings, data.settings);
    isSaving.value = false;
    successfullySaved.value = true;
    setTimeout(() => {
      successfullySaved.value = false;
    }, 2000);
  } catch (error) {
    isSaving.value = false;
    alert('Error saving settings: ' + error);
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

@media (prefers-color-scheme: dark) {
  hr {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
