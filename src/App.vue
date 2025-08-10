<template>
  <div>
    <Menu />
    <WelcomeModal v-if="shouldShowWelcomeModal" @close="handleWelcomeModalClose" />
    <router-view> </router-view>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import Menu from "./components/Menu.vue";
import WelcomeModal from "./components/WelcomeModal.vue";
import { currentLoggedInUser, hasUserJustSignedUp, userSettings } from "./GlobalState";

const shouldShowWelcomeModal = computed(() => {
  return hasUserJustSignedUp.value && currentLoggedInUser.value !== null;
});

const handleWelcomeModalClose = () => {
  hasUserJustSignedUp.value = false;
};

onMounted(() => {
  const loadUserSettings = async () => {
    try {
      const response = await fetch(`/api/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Update global settings state
        Object.assign(userSettings, data.settings);
      } else {
        console.error("Failed to load user settings");
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };
  if (currentLoggedInUser.value) {
    loadUserSettings();
  }
});
</script>

<style scoped></style>
