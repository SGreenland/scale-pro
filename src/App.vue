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
  userUnlockedPatterns
} from "./GlobalState";

const shouldShowWelcomeModal = computed(() => {
  return hasUserJustSignedUp.value && currentLoggedInUser.value !== null;
});

onBeforeMount(() => {
  axios
      .get("api/note-patterns")
      .then((response) => {
        availablePatterns.value = response.data.notePatterns;
        userUnlockedPatterns.value = response.data.unlockedPatterns || [];
      })
      .catch((error) => {
        console.error("Error fetching note patterns:", error);
      });
})

const handleWelcomeModalClose = () => {
  hasUserJustSignedUp.value = false;
};

watch(() => currentLoggedInUser.value?.userSettings?.startingPattern, (newStartingPattern) => {
  if (newStartingPattern) {

    scaleConfig.selectedPattern = newStartingPattern;
  }
}, { immediate: true, deep: true });

</script>

<style scoped></style>
