<template>
  <div>
    <Menu />
    <router-view> </router-view>
  </div>
</template>

<script setup lang="ts">
import Menu from "./components/Menu.vue";
import { currentLoggedInUser, settings } from "./GlobalState";

import { onMounted } from "vue";
onMounted(() => {
  // Check if user is logged in
  if (currentLoggedInUser.value) {
    loadUserSettings();
  }
});

const loadUserSettings = async () => {
  try {
    const response = await fetch(`/api/settings/${currentLoggedInUser.value?.id}`);
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
