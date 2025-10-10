<template>
  <div>
    <modal-wrapper :mask="false" :hasCloseButton="false">
      <div
        class="h-40 rounded-t-xl bg-custom-gradient relative left-[-1rem] top-[-1rem] w-[calc(100%+2rem)] mb-2"
      >
        <img
          class="h-full scale-[1.5] m-auto dark:brightness-[0.5]"
          src="/assets/images/scale maestro.png"
          alt=""
        />
      </div>
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold mb-2">Create Your Free Account</h1>
        <p class="text-gray-700 dark:text-gray-100 text-sm">
          Sign up to unlock <strong>premium features free for 7 days</strong>.
          <br />
          <em>No credit card required.</em>
        </p>
      </div>

      <form class="text-left" @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="username" :class="labelClasses">Username</label>
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
          <label for="email" :class="labelClasses">Email</label>
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
          <label for="password" :class="labelClasses">Password</label>
          <PasswordInput
            v-model="formData.password"
            type="password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <span v-if="errors.password" class="text-red-500 text-sm">{{
            errors.password
          }}</span>
        </div>

        <div class="mb-4">
          <label for="confirm-password" :class="labelClasses"
            >Confirm Password</label
          >
          <ConfirmPasswordInput
            :password-to-match="formData.password"
            v-model="formData.confirmPassword"
            type="password"
            id="confirm-password"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <span v-if="errors.confirmPassword" class="text-red-500 text-sm">{{
            errors.confirmPassword
          }}</span>
        </div>

        <submit-button :isSubmitting="isSubmitting">
          Start Free Trial
        </submit-button>
      </form>

      <p class="text-center text-xs text-gray-500 dark:text-gray-100 mt-4">
        Your free trial includes access to all features for 7 days.
      </p>
    </modal-wrapper>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { currentLoggedInUser, hasUserJustSignedUp } from "../GlobalState";
import ModalWrapper from "../components/reuseable/ModalWrapper.vue";
import PasswordInput from "../components/reuseable/PasswordInput.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import ConfirmPasswordInput from "../components/reuseable/ConfirmPasswordInput.vue";

const router = useRouter();

const labelClasses: string =
  "block text-sm font-medium text-gray-700 dark:text-gray-300";

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
      currentLoggedInUser.value = response.data.user;
      // Set flag to indicate user just signed up
      hasUserJustSignedUp.value = true;
      //redirect to home
      router.push("/");
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
