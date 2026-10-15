<template>
    <div>
        Great we've set you up with an appropriate starting note!
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import useSetupWizard from "../../composables/useSetupWizard";
import {voiceTypeStartNoteMap, instrumentStartNoteMap } from "../../data/wizardData";
import { scaleConfig } from "../../GlobalState";

const { voiceOrInstrument, voiceType } = useSetupWizard();

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