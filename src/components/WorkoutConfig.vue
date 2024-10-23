<template>
        <div class="grid lg:grid-cols-[minmax(0,1fr),minmax(0,1fr),minmax(0,2fr)] grid-cols-2 gap-3">
            <div :class="inputClasses">
                <label class="text-left" for="startNote">Start Note</label>
                <select v-model="workoutConfig.startNote">
                    <option v-for="note in notes" :key="note.name" :value="note.name">{{ note.name }}</option>
                </select>
            </div>
            <div :class="inputClasses">
                <label class="text-left" for="endNote">End Note</label>
                <select v-model="workoutConfig.endNote">
                    <option v-for="note in endNotePossibilities" :key="note.name" :value="note.name">{{ note.name }}</option>
                </select>
            </div>
            <!--scale type-->
            <div :class="inputClasses + ' z-50 col-span-2 lg:col-span-1'">
                <label class="text-left" for="scaleType">Scale(s)</label>
                <!-- <select v-model="workoutConfig.scale">
                    <option v-for="scale in Object.keys(scales)" :key="scale" :value="scale">{{ scale }}</option>
                </select> -->
                <MultiSelectInput :items="Object.keys(scales)" v-model="workoutConfig.scales" />
            </div>
        </div>
</template>

<script setup lang="ts">
import { workoutConfig } from "../GlobalState";
import { notes, scales } from "../NotesAndScales";
import { computed, watch } from "vue";
import MultiSelectInput from "./reuseable/MultiSelectInput.vue";

const inputClasses = 'flex flex-col';

// end note possibilities are all notes with a higher index than the start note
const endNotePossibilities = computed(() => notes.slice(notes.findIndex(note => note.name === workoutConfig.startNote) + 1));

// watch for changes in start note and update end note
watch(() => workoutConfig.startNote, () => {
    // if end note is not in the possibilities, set it to the first possibility
    if (!endNotePossibilities.value.find(note => note.name === workoutConfig.endNote)){
        workoutConfig.endNote = endNotePossibilities.value[0].name;
    }
});

</script>

<style scoped>

</style>