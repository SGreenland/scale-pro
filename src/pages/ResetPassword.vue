<template>
    <card-wrapper max-width="500px">
        <div v-if="!passwordResetSuccess">
            <h2 class="text-2xl font-semibold mb-4 text-center">Reset Password</h2>
            <p class="mb-4">
                Enter your new password below to reset your account password.
            </p>
            <span v-if="errorMessage" class="text-red-400">{{ errorMessage }}</span>
            <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
                <div class="flex flex-col">
                <password-input
                    v-model="newPassword"
                />
                </div>
                <submit-button :is-submitting="isSubmitting">Reset Password</submit-button>
            </form>
        </div>
        <div v-else>
            Your password has been successfully reset. You can now <router-link to="/login" class="text-blue-600 hover:underline">log in</router-link> with your new password.
        </div>
    </card-wrapper>
</template>

<script setup lang="ts">
import CardWrapper from "../components/reuseable/CardWrapper.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import PasswordInput from "../components/reuseable/PasswordInput.vue";
import { ref } from "vue";
import axios from "axios";

const newPassword = ref("");
const isSubmitting = ref(false);
const passwordResetSuccess = ref(false);
const errorMessage = ref("");

const getTokenFromUrl = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get("token");
};

const handleSubmit = () => {
  const token = getTokenFromUrl();
  if (!token) {
    errorMessage.value = "Invalid or missing token.";
    return;
  }

  isSubmitting.value = true;
  axios.post("/api/reset-password", { token, newPassword: newPassword.value })
    .then(() => {
      passwordResetSuccess.value = true;
    })
    .catch(() => {
      errorMessage.value = 'Failed to reset password. Please try again later.';
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};

</script>
