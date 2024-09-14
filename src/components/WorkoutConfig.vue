<template>
    <div class="flex flex-col w-full">
        <div class="grid lg:grid-cols-3 grid-cols-2 gap-2">
            <div class="flex flex-col">
                <label for="startNote">Start Note</label>
                <select v-model="workoutConfig.startNote" type="text">
                    <option v-for="note in notes" :key="note.name" :value="note.name">{{ note.name }}</option>
                </select>
            </div>
            <div class="flex flex-col">
                <label for="endNote">End Note</label>
                <select v-model="workoutConfig.endNote" type="text">
                    <option v-for="note in notes" :key="note.name" :value="note.name">{{ note.name }}</option>
                </select>
            </div>
            <!--scale type-->
            <div class="flex flex-col">
                <label for="scaleType">Scale</label>
                <select v-model="workoutConfig.scale" type="text">
                    <option v-for="scale in Object.keys(scales)" :key="scale" :value="scale">{{ scale }}</option>
                </select>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { workoutConfig } from "../GlobalState";
import { notes, scales } from "../NotesAndScales";

</script>

<style scoped>

</style>