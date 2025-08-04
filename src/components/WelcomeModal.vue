<template>
    <modal-wrapper>
        <h2 class="text-lg font-semibold mb-4">Welcome to Scale Maestro {{ currentLoggedInUser?.userName }}!</h2>
        <p class="mb-4">To get the most out of your free trial, consider watching our 'Getting Started' video <a href="#">here</a>  </p>
        <p class="mb-4">Otherwise feel free to explore yourself and have fun!</p>
    </modal-wrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "./reuseable/ModalWrapper.vue";
import { currentLoggedInUser} from "../GlobalState";

</script>