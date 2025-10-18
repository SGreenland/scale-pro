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
import { computed, onBeforeMount, watch } from "vue";
import Menu from "./components/Menu.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import {
  availablePatterns,
  currentLoggedInUser,
  hasUserJustSignedUp,
  scaleConfig,
  selectedPatternCategory,
  userUnlockedPatternIds,
} from "./GlobalState";

const shouldShowWelcomeModal = computed(() => {
  return hasUserJustSignedUp.value && currentLoggedInUser.value !== null;
});

const handleWelcomeModalClose = () => {
  hasUserJustSignedUp.value = false;
};

onBeforeMount(() => {
  //check for existing session token
  if (!currentLoggedInUser.value) {
    axios.post("/api/persist-login").then((response) => {
      if (response.data.user) {
        currentLoggedInUser.value = response.data.user;
      }
    });
  }
});

watch(
  () => currentLoggedInUser.value,
  () => {
    axios
      .get("api/note-patterns")
      .then((response) => {
        availablePatterns.value = response.data.notePatterns;
        if (currentLoggedInUser.value?.settings) {
          scaleConfig.selectedPattern =
            availablePatterns.value.find(
              (p) =>
                p.id === currentLoggedInUser.value?.settings?.startingPattern.id
            ) || availablePatterns.value[0];
          scaleConfig.selectedNote =
            currentLoggedInUser.value?.settings?.startingRootNote || "C3";
          selectedPatternCategory.value = scaleConfig.selectedPattern.type;
        } else {
          scaleConfig.selectedPattern = availablePatterns.value[0];
          scaleConfig.selectedNote = "C3";
          selectedPatternCategory.value = "scale";
        }
        userUnlockedPatternIds.value = response.data.unlockedPatterns || [];
      })
      .catch((error) => {
        console.error("Error fetching note patterns:", error);
      });
  },
  { immediate: true, deep: true }
);
</script>

<style scoped></style>
