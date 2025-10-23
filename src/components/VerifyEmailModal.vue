<template>
  <modal-wrapper @close="$emit('close')">
    <div v-if="!emailSent" class="p-6">
      <h2 class="text-xl font-semibold mb-4">Verify Your Email</h2>
      <p class="mb-4">
        A verification email has been sent to your email address. Please check your inbox and click on the verification link to activate your account. If you did not receive the email, you can click the "Resend" button to send another verification email.
      </p>
      <!--send again button-->
      <div class="flex justify-end gap-2">
        <submit-button width-class="w-20" :is-submitting="isSubmitting" @click="resendVerificationEmail">Resend</submit-button>
        <button @click="$emit('close')" class="inverted-btn">Close</button>
      </div>
    </div>
    <div v-else class="p-6">
      <h2 class="text-xl font-semibold mb-4">Verification Email Sent</h2>
      <p class="mb-4">
        A new verification email has been sent to {{ userEmail }}. Please check your inbox and click on the verification link to activate your account.
      </p>
      <div class="flex justify-end">
        <button @click="$emit('close')" class="inverted-btn">Close</button>
      </div>
    </div>
  </modal-wrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "./reuseable/ModalWrapper.vue";
import SubmitButton from "./reuseable/SubmitButton.vue";
import axios from "axios";
import { ref } from "vue";

const props = defineProps({
  userEmail: {
    type: String,
    required: true,
  },
});

const emailSent = ref(false);
const isSubmitting = ref(false);

const resendVerificationEmail = () => {
  isSubmitting.value = true;
  axios
    .post("/api/resend-verification-email", { email: props.userEmail })
    .then(() => {
      emailSent.value = true;
    })
    .catch(() => {
      alert("Failed to resend verification email. Please try again later.");
    })
    .finally(() => {
      isSubmitting.value = false;
    });
};
</script>
