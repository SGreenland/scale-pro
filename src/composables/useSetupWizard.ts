import { VoiceType } from 'src/types';
import { ref } from 'vue';

// dynamic values persisted across wizard steps
const voiceOrInstrument = ref<'vocalist'| 'instrumentalist'>('vocalist');
const voiceType = ref<VoiceType|null>(null);
const experienceLevel = ref<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');


export default function useSetupWizard() {
    const shouldShowWizard = ref(false);

    function checkFirstVisit() {
        console.log('Checking first visit...');
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited) {
            shouldShowWizard.value = true;
            localStorage.setItem('hasVisited', 'true');
        }
    }

    const currentStep = ref(0);


    function nextStep() {
        currentStep.value++;
    }

    function prevStep() {
        if (currentStep.value > 1) {
            currentStep.value--;
        }
    }

    return {
        shouldShowWizard,
        checkFirstVisit,
        currentStep,
        nextStep,
        prevStep,
        voiceOrInstrument,
        voiceType,
        experienceLevel,
    };
}

