<template>
  <div>
    <Menu />
    <WelcomeModal
      v-if="shouldShowWelcomeModal"
      @close="handleWelcomeModalClose"
    />
    <router-view> </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import Menu from "./components/Menu.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import {
  currentLoggedInUser,
  hasUserJustSignedUp,
  scaleConfig
} from "./GlobalState";

const shouldShowWelcomeModal = computed(() => {
  return hasUserJustSignedUp.value && currentLoggedInUser.value !== null;
});

const handleWelcomeModalClose = () => {
  hasUserJustSignedUp.value = false;
};

onMounted(() => {
  if (currentLoggedInUser.value?.userSettings) {
    scaleConfig.selectedNote = currentLoggedInUser.value.userSettings.startingRootNote;
    scaleConfig.selectedScale = currentLoggedInUser.value.userSettings.startingScale;
  }
})

</script>

<style scoped></style>
