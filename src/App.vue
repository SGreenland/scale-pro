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
import { computed, onMounted, watch } from "vue";
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

watch(() => currentLoggedInUser.value, (newUser) => {
  if (newUser?.userSettings) { {
    scaleConfig.selectedNote = newUser.userSettings.startingRootNote;
    scaleConfig.selectedPattern = newUser.userSettings.startingPattern;
  }
  }
}, { immediate: true, deep: true });

</script>

<style scoped></style>
