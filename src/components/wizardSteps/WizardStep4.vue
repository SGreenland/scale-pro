<template>
    <div>
        OK - We've selected an appropriate starting scale for you...feel free to change it though.
        <div class="mt-1 text-sm italic">More scale options are available when you sign up to Pro or try our Free trial!</div>
    </div>
</template>

<script setup lang="ts">
import useSetupWizard from "../../composables/useSetupWizard";
import {experienceScaleMap} from "../../data/wizardData";
import { scaleConfig, availablePatterns } from "../../GlobalState";

const { experienceLevel } = useSetupWizard();

scaleConfig.selectedPattern = availablePatterns.value.find(pattern => pattern.name === experienceScaleMap[experienceLevel.value]) || availablePatterns.value[0];

</script>

<style scoped>

</style>