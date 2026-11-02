<template>
    <div>
        <div class="my-3">
            Great we've set you up with an appropriate starting note!
        </div>
        <div class="mb-3">
            Please select your experience level:
        </div>
        <div class="grid gap-2 place-items-center">
            <span class="flex gap-2">
                <input type="radio" id="experience-level" name="experience-level" value="Beginner" v-model="experienceLevel">
                <label for="beginner">Beginner</label>
            </span>
            <span class="flex gap-2">
                <input type="radio" id="experience-level" name="experience-level" value="Intermediate" v-model="experienceLevel">
                <label for="intermediate">Intermediate</label>
            </span>
            <span class="flex gap-2">
                <input type="radio" id="experience-level" name="experience-level" value="Advanced" v-model="experienceLevel">
                <label for="advanced">Advanced</label>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import useSetupWizard from "../../composables/useSetupWizard";
import {voiceTypeStartNoteMap, instrumentStartNoteMap } from "../../data/wizardData";
import { scaleConfig } from "../../GlobalState";

const { voiceOrInstrument, voiceType, experienceLevel } = useSetupWizard();

function getSuggestedStartingNote() {
    if (voiceOrInstrument.value === "vocalist") {
        return voiceTypeStartNoteMap[voiceType.value as keyof typeof voiceTypeStartNoteMap];
    } else {
        return instrumentStartNoteMap[voiceType.value as keyof typeof instrumentStartNoteMap];
    }
}

onBeforeMount(() => {
    scaleConfig.selectedNote = getSuggestedStartingNote()
});
</script>

<style scoped>

</style>