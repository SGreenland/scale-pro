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
import { currentLoggedInUser, settings, hasUserJustSignedUp } from "./GlobalState";

onMounted(() => {
  // Check if user is logged in
  if (currentLoggedInUser.value) {
    loadUserSettings();
  }
});

const shouldShowWelcomeModal = computed(() => {
  return hasUserJustSignedUp.value && currentLoggedInUser.value !== null;
});

const handleWelcomeModalClose = () => {
  hasUserJustSignedUp.value = false;
};

const loadUserSettings = async () => {
  try {
    const response = await fetch(
      `/api/settings/${currentLoggedInUser.value?.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("token="))
              ?.split("=")[1]
          }`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      // Update global settings state
      Object.assign(settings, data.settings);
    } else {
      console.error("Failed to load user settings");
    }
  } catch (error) {
    console.error("Error loading user settings:", error);
  }
};
</script>

<style scoped></style>
