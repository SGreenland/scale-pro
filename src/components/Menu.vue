<template>
  <div class="fixed lg:right-2 right-0 md:top-2 top-0 z-[1000]">
    <!-- <div class="d-none lg:d-block text-indigo-900 dark:text-indigo-200 font-bold text-lg mb-2">
      Menu
    </div> -->
    <font-awesome-icon
      :icon="!isOpen ? faBars : faXmark"
      class="text-2xl cursor-pointer fixed md:top-2 top-0 lg:right-2 right-0 p-2 text-indigo-900 dark:text-indigo-200 z-50 rounded-full bg-indigo-100 dark:bg-indigo-800"
      :class="{'shadow-lg': !isOpen}"
      @click="isOpen = !isOpen"
    />
    <div
      v-if="isOpen"
      class="relative card p-4 bg-indigo-100 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200 rounded-lg shadow-lg flex flex-col gap-2 items-center"
    >
      <ul class="list-none flex flex-col gap-2 items-center">
        <router-link v-for="link in menuLinks" :key="link.name" :to=link.path @click="isOpen = false">{{ link.name }}</router-link>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { RouterLink } from "vue-router";

const isUserLoggedIn = ref(false); // This should be replaced with actual authentication logic

const menuLinks = computed(() =>[
  { name: "Home", path: "/" },
  { name: isUserLoggedIn.value ? 'Logout' : 'Login' , path: isUserLoggedIn.value ? '/logout' : '/login' },
  { name: "Signup", path: "/signup" },
  // { name: "My Pitch Data", path: "/my-pitch-data" },
  // { name: "My Account", path: "/my-account" },
  { name: "Settings", path: "/settings" }
]);

const isOpen = ref(false);
</script>

<style scoped></style>
