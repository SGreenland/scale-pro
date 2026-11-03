<template>
    <div class="flex px-6 pt-2 flex-col gap-4 items-center">
        <div>Are you a vocalist or instrumentalist? This will help us tailor the experience to your needs.</div>
        <custom-radio-chips :options="['vocalist', 'instrumentalist']" v-model="voiceOrInstrument"></custom-radio-chips>
    </div>
</template>

<script setup lang="ts">
import CustomRadioChips from '../reuseable/CustomRadioChips.vue';
import { ref, watch } from 'vue';
import useSetupWizard from '../../composables/useSetupWizard';

const { voiceOrInstrument, disableNext } = useSetupWizard();

watch(voiceOrInstrument, (newValue) => {
    disableNext.value = !newValue;
}, { immediate: true });
</script>

<style scoped>

</style>