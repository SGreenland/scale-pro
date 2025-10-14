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
import axios from "axios";
import { computed, watch } from "vue";
import Menu from "./components/Menu.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import {
  availablePatterns,
  currentLoggedInUser,
  hasUserJustSignedUp,
  scaleConfig,
  selectedPatternCategory,
  userUnlockedPatterns
} from "./GlobalState";

const shouldShowWelcomeModal = computed(() => {
  return hasUserJustSignedUp.value && currentLoggedInUser.value !== null;
});


const handleWelcomeModalClose = () => {
  hasUserJustSignedUp.value = false;
};

watch(() => currentLoggedInUser.value, () => {
   axios
      .get("api/note-patterns")
      .then((response) => {
        availablePatterns.value = response.data.notePatterns;
        if(currentLoggedInUser.value?.userSettings){
          scaleConfig.selectedPattern = availablePatterns.value.find(p => p.id === currentLoggedInUser.value?.userSettings?.startingPattern.id) || availablePatterns.value[0];
          scaleConfig.selectedNote = currentLoggedInUser.value?.userSettings?.startingRootNote || 'C3';
          selectedPatternCategory.value = scaleConfig.selectedPattern.type;
        } else if(availablePatterns.value.length > 0) {
          scaleConfig.selectedPattern = availablePatterns.value[0];
          scaleConfig.selectedNote = 'C3';
          selectedPatternCategory.value = 'scale';
        }
        userUnlockedPatterns.value = response.data.unlockedPatterns || [];
      })
      .catch((error) => {
        console.error("Error fetching note patterns:", error);
      });
}, { immediate: true, deep: true });

</script>

<style scoped></style>
