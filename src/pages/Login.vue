<template>
  <div>
    <modal-wrapper :mask="false" :hasCloseButton="false">
    <div class="h-40 rounded-t-xl bg-custom-gradient relative left-[-1rem] top-[-1rem] w-[calc(100%+2rem)] mb-2">
      <img class="h-full scale-[1.5] m-auto dark:brightness-[0.5]" src="/assets/images/scale-maestro.png" alt="">
    </div>
      <!-- <h1 class="text-lg font-bold my-4">Sign in</h1> -->
      <form class="text-left" @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-100"
            >Email</label
          >
          <input
            v-model="formData.email"
            type="email"
            id="email"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <span v-if="errors.email" class="text-red-500 text-sm">{{
            errors.email
          }}</span>
        </div>
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-100"
            >Password</label
          >
          <input
            v-model="formData.password"
            type="password"
            id="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{
            errors.password
          }}</span>
        </div>
        <submit-button @click="handleSubmit" :isSubmitting="isSubmitting"
          >Login</submit-button
        >
      </form>
      <router-link to="/signup" class="text-sm text-blue-600 hover:underline mt-4 block"
        >Don't have an account? Sign up</router-link>
      <router-link to="/forgot-password" class="text-sm text-blue-600 hover:underline mt-2 block"
        >Forgot your password?</router-link>
    </modal-wrapper>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import ModalWrapper from "../components/reuseable/ModalWrapper.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import { currentLoggedInUser, showVerifyEmailModal, emailToVerify } from "../GlobalState";


const router = useRouter();

const formData = reactive({
  email: "",
  password: "",
});

const errors = reactive({
  email: "",
  password: "",
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    const response = await axios.post("/api/login", formData);
    if (response.data.user) {
      // Set the current logged-in user
      currentLoggedInUser.value = {
        userName: response.data.user.userName,
        email: response.data.user.email,
        trialExpiresAt: response.data.user.trialExpiresAt,
        subscriptionId: response.data.user.subscriptionId,
        settings: response.data.user.settings,
        hasPremiumAccess: response.data.hasPremiumAccess,
      };
      // Redirect to home
      router.push("/");
    } else {
      isSubmitting.value = false;
      if(response.data.verified === false) {
        emailToVerify.value = formData.email;
        router.push("/");
        showVerifyEmailModal.value = true;
      }
      else {
        errors.email = "An unexpected error occurred. Please try again.";
      }
    }
  } catch (error: any) {
    const errorData = JSON.parse(error.response?.data?.error) || {};
    errors.email = errorData.email || "";
    errors.password = errorData.password || "";
    if (!errors.email && !errors.password) {
      errors.email = "An unexpected error occurred. Please try again.";
    }
    isSubmitting.value = false;
  }
};
</script>
