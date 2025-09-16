<template>
  <div class="flex flex-wrap gap-3 items-end">
    <div :class="inputClasses">
      <label class="text-left" for="startNote">Start Note</label>
      <select v-model="workoutConfig.startNote">
        <option v-for="note in notes" :key="note.name" :value="note.name">
          {{ note.name }}
        </option>
      </select>
    </div>
    <div :class="inputClasses">
      <label class="text-left" for="endNote">End Note</label>
      <select v-model="workoutConfig.endNote">
        <option
          v-for="note in endNotePossibilities"
          :key="note.name"
          :value="note.name"
        >
          {{ note.name }}
        </option>
      </select>
    </div>
    <!--scale type-->
    <div :class="inputClasses + ' z-50 grow'">
      <label class="text-left" for="scaleType">Scale(s)</label>
      <div class="flex gap-2 items-center">
          <MultiSelectInput
            class="grow"
            :workout-in-progress="props.workoutInProgress"
            :items="Object.keys(scales)"
            v-model="workoutConfig.scales"
          />
          <dropdown>
            <template #trigger>
              <font-awesome-icon
                class="rotate-90 cursor-pointer h-8"
                :icon="faEllipsis"
              />
            </template>
            <template #content>
              <div class="gap-2 text-left">
                <div role="button" class="hover:bg-gray-200 pl-2">
                  Advanced Settings
                </div>
                <div role="button" class="hover:bg-gray-200 pl-2">Save Current</div>
                <div role="button" class="hover:bg-gray-200 pl-2">Load Workout</div>
              </div>
            </template>
          </dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { workoutConfig } from "../GlobalState";
import { notes } from "../NotesAndScales";
import { computed, watch } from "vue";
import MultiSelectInput from "./reuseable/MultiSelectInput.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "./reuseable/Dropdown.vue";

const props = defineProps<{
  workoutInProgress: boolean;
}>();

const inputClasses = "flex flex-col max-sm:grow";

// end note possibilities are all notes with a higher index than the start note
const endNotePossibilities = computed(() =>
  notes.slice(
    notes.findIndex((note) => note.name === workoutConfig.startNote) + 1
  )
);

// watch for changes in start note and update end note
watch(
  () => workoutConfig.startNote,
  () => {
    // if end note is not in the possibilities, set it to the first possibility
    if (
      !endNotePossibilities.value.find(
        (note) => note.name === workoutConfig.endNote
      )
    ) {
      workoutConfig.endNote = endNotePossibilities.value[0].name;
    }
  }
);
</script>

<style scoped></style>
