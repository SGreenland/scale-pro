<template>
    <div class="grid place-items-center">
        <div class="mb-2">
           🎉 The Setup Wizard is now complete, enjoy exploring the app!
        </div>
        <div>
            We'd advise reading the <a role="button" @click="showPitchTrackingInfo = true">help section</a> for pitch tracking to get the most out of the app.
        </div>
        <p class="text-xs">Please note that if you refresh the page or close the app, your pitch tracking settings may be lost. <a href="/signup">Sign up</a> to gain persistent access to your settings, along with many other benefits.</p>
        <div v-if="showPitchTrackingInfo">
            <PitchTrackingInfoModal
                v-if="showPitchTrackingInfo"
                @close="showPitchTrackingInfo = false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PitchTrackingInfoModal from "../PitchTrackingInfoModal.vue";

const showPitchTrackingInfo = ref(false);

</script>

<style scoped>

</style>