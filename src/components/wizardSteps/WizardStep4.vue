<template>
    <div>
        OK - we've selected an appropriate starting scale for you...we've also set your pitch tolerance to match your experience level.
        <div class="my-2 text-sm italic">You can always adjust this setting later in the app settings. (Just click the cog under the pitch tracking tab).</div>
    </div>
</template>

<script setup lang="ts">
import useSetupWizard from "../../composables/useSetupWizard";
import {experienceScaleMap, experiencePitchToleranceMap} from "../../data/wizardData";
import { scaleConfig, availablePatterns, settings } from "../../GlobalState";

const { experienceLevel } = useSetupWizard();

scaleConfig.selectedPattern = availablePatterns.value.find(pattern => pattern.name === experienceScaleMap[experienceLevel.value]) || availablePatterns.value[0];
settings.pitchToleranceLevel = experiencePitchToleranceMap[experienceLevel.value];


</script>

<style scoped>

</style>