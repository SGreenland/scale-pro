<template>
    <ModalWrapper @close="$emit('close')">
        <div class="text-center">
            <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            🎤 Pitch Tracking Info
            </h2>
            <p class="text-lg text-gray-800 dark:text-gray-200 mb-4">
                This feature tracks your pitch in real-time, providing feedback on
                your singing or playing accuracy.
            </p>
            <p class="text-lg text-gray-800 dark:text-gray-200 mb-4">
                <p>Simply click 'Start Pitch Tracking' and sing the selected scale or arpeggio. For best results make sure you are singing at a moderate level and close to your device's microphone.</p> <br>
                <b>Tip:</b> <i>First listen to the scale for reference, then try to match the pitch as closely as possible. You can sing/play the scale at any speed.</i>
            </p>
        </div>
      </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from './reuseable/ModalWrapper.vue';


</script>