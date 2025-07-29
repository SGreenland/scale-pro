<template>
  <div>
    <modal-wrapper :mask="false" :hasCloseButton="false">
      <h1 class="text-2xl font-bold mb-4">Sign Up</h1>
      <form class="text-left" @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700"
            >Username</label
          >
          <input
            maxlength="20"
            v-model="formData.userName"
            type="text"
            id="username"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700"
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
          <label for="password" class="block text-sm font-medium text-gray-700"
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
        <div class="mb-4">
          <label
            for="confirm-password"
            class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <input
            v-model="formData.confirmPassword"
            type="password"
            id="confirm-password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{
            errors.confirmPassword
          }}</span>
        </div>
        <submit-button
          @click="handleSubmit"
          :isSubmitting="isSubmitting"
          buttonText="Sign Up"
        ></submit-button>
      </form>
    </modal-wrapper>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { currentLoggedInUser } from "../GlobalState";
import ModalWrapper from "../components/reuseable/ModalWrapper.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";

const formData = reactive({
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});
const isSubmitting = ref(false);

const handleSubmit = () => {
  isSubmitting.value = true;
  axios
    .post("/api/signup", formData)
    .then((response) => {
      // Set read-only cookie with token
      document.cookie = `token=${response.data.token}; path=/; secure; samesite=strict`;
      // Set the current logged-in user
      currentLoggedInUser.value = {
        id: response.data.user.id,
        userName: response.data.user.userName,
        email: response.data.user.email,
      };
      //redirect to home
      window.location.href = "/";
    })
    .catch((error) => {
      if (error.response && error.response.data && error.response.data.errors) {
        // Populate errors from the response
        Object.assign(errors, error.response.data.errors);
      } else {
        alert("Signup failed due to an unexpected error.");
      }
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>
