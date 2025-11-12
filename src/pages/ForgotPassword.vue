<template>
    <card-wrapper title="Forgot Password" :title-rule="false" max-width="500px">
        <div v-if="!formIsSent">
            <p class="mb-4">
                Enter your email address below, and we'll send you a link to reset your password.
            </p>
            <span v-if="errorMessage" class="text-red-400">{{ errorMessage }}</span>
            <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
                <div class="flex flex-col">
                <input
                    v-model="email"
                    type="email"
                    id="email"
                    required
                    class="input-field"
                    placeholder="Email Address"
                />
                </div>
                <submit-button :is-submitting="isSubmitting">Send Reset Link</submit-button>
            </form>
        </div>
        <div v-else>
            If the email you provided is associated with an account, a password reset link has been sent. Please check your inbox.
        </div>
    </card-wrapper>
</template>

<script setup lang="ts">
import CardWrapper from "../components/reuseable/CardWrapper.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const isSubmitting = ref(false);
const formIsSent = ref(false);
const errorMessage = ref("");

const handleSubmit = () => {
  isSubmitting.value = true;
  axios.post("/api/forgot-password", { email: email.value })
    .then(() => {
      formIsSent.value = true;
    })
    .catch(() => {
      errorMessage.value = 'Failed to send reset link. Please try again later.';
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>