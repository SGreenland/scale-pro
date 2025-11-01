<template>
  <div v-click-away:[isOpen] class="fixed lg:right-2 right-0 md:top-2 top-0 z-[1000]" style="min-width: 180px;">
    <font-awesome-icon
      :icon="!isOpen ? faBars : faXmark"
      class="text-2xl cursor-pointer fixed md:top-2 top-2 right-2 max-sm:p-1 p-2 text-indigo-900 dark:text-indigo-200 z-50 rounded-full bg-indigo-100 dark:bg-indigo-800"
      :class="{'shadow dark:shadow-white': !isOpen}"
      @click="isOpen = !isOpen"
    />
    <div
      v-if="isOpen"
      class="relative card p-4 bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 rounded-lg shadow-lg flex flex-col gap-2 items-center"
    >
    <h3 v-if="isUserLoggedIn" class="p-2 border-b border-indigo-800 dark:border-white text-center" style="width: calc(100% + 4rem);">
      {{ `Hi, ${currentLoggedInUser?.userName}` }}
    </h3>
      <ul class="list-none flex flex-col gap-2 items-center">
        <div v-for="link in filteredMenuLinks" :key="link.name">
          <router-link class="dark:text-indigo-200 dark:hover:text-indigo-300" :to=link.path @click="isOpen = false">{{ link.name }}</router-link>
        </div>
        <a v-if="currentLoggedInUser" role="button" class="router-link dark:text-indigo-200 dark:hover:text-indigo-300" @click="handleLogout">Logout</a>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { currentLoggedInUser } from "../GlobalState";
import axios from "axios";

const router = useRouter();

const isUserLoggedIn = computed(() => {
  return currentLoggedInUser.value !== null;
});

const handleLogout = () => {
  sessionStorage.clear(); // Clear session storage
  // post to logout endpoint to clear cookie
  axios.post("/api/logout").then(() => {
    currentLoggedInUser.value = null;
    isOpen.value = false;
    router.push("/login");
  });
}


const filteredMenuLinks = computed(() => {
  return menuLinks.filter(link => {
    if (link.name === 'Login' || link.name === 'Signup') {
      return !isUserLoggedIn.value;
    }
    if (link.name === 'Logout' || link.name === 'My Account' || link.name === 'My Pitch Data') {
      return isUserLoggedIn.value;
    }
    if(link.name === 'Upgrade') {
      return isUserLoggedIn.value && (currentLoggedInUser.value?.trialExpiresAt || !currentLoggedInUser.value?.hasPremiumAccess);
    }
    if(link.name === 'Verify Email') {
      return false; // Hide Verify Email link for now
    }
    return true;
  });
});


const menuLinks = router.getRoutes();

const isOpen = ref(false);

defineExpose({
  isOpen
});
</script>

<style scoped></style>
