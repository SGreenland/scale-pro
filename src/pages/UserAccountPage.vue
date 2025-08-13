<template>
  <card-wrapper title="My Account" with-back-arrow>
    <div>
      <p v-if="currentLoggedInUser?.trialExpiresAt">
       {{ countdownTimerMHS ? `Trial ends in: ${countdownTimerMHS}` : "Your trial has expired..." }}
        <router-link to="/upgrade">Upgrade Now!</router-link>
      </p>
      <div class="grid gap-2 mb-4">
        <div :class="formFieldClasses">
          <label for="username">Username</label>
          <input id="username" v-model="username" type="text" />
        </div>
        <div :class="formFieldClasses">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" />
        </div>
        <submit-button
          @click="handleProfileUpdate"
          :is-submitting="isSubmittingProfileUpdate"
          >{{ profileUpdateBtnText }}</submit-button
        >
      </div>

      <hr />

      <form @submit.prevent="handlePwUpdate" class="grid gap-4">
        <h2 class="text-lg">Change Password</h2>
        <div :class="formFieldClasses">
          <label for="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            required
            placeholder="Enter current password"
            v-model="currentPassword"
          />
          <span v-if="currentPasswordError" class="text-red-500">{{
            currentPasswordError
          }}</span>
        </div>
        <div :class="formFieldClasses">
          <label for="new-password">New Password</label>
          <PasswordInput
            class="w-full"
            id="new-password"
            required
            placeholder="Enter new password"
            v-model="newPassword"
          />
          <span v-if="passwordError" class="text-red-500">{{
            passwordError
          }}</span>
        </div>
        <div :class="formFieldClasses">
          <label for="confirm-password">Confirm New Password</label>
          <ConfirmPasswordInput
            id="confirm-password"
            type="password"
            required
            placeholder="Confirm new password"
            v-model="confirmNewPassword"
            :password-to-match="newPassword"
          />
          <span v-if="passwordError" class="text-red-500">{{
            passwordError
          }}</span>
          <submit-button :is-submitting="isSubmittingPwUpdate"
            >Update Password</submit-button
          >
        </div>
      </form>
    </div>
  </card-wrapper>
</template>

<script setup lang="ts">
import axios, { isAxiosError } from "axios";
import { ref } from "vue";
import { currentLoggedInUser } from "../GlobalState";
import CardWrapper from "../components/reuseable/CardWrapper.vue";
import ConfirmPasswordInput from "../components/reuseable/ConfirmPasswordInput.vue";
import PasswordInput from "../components/reuseable/PasswordInput.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";

const username = ref<string>(currentLoggedInUser.value?.userName || "");
const email = ref<string>(currentLoggedInUser.value?.email || "");
const currentPassword = ref<string>("");
const newPassword = ref<string>("");
const confirmNewPassword = ref<string>("");
const passwordError = ref<string>("");
const currentPasswordError = ref<string>("");

const formFieldClasses = "grid gap-2 text-start mb-2";

const profileUpdateBtnText = ref<string>("Update");
const countdownTimerMHS = ref<string>(getTimer());



function getTimer() {
  let timer = setInterval(() => {
  countdownTimerMHS.value = getTimer();
  }, 6000);
  const expiryDate = currentLoggedInUser.value?.trialExpiresAt;
  const expiryDateObj = new Date(expiryDate!);
  const now = new Date();
  if(expiryDate && expiryDateObj <= now) {
    clearInterval(timer);
    return '';
  }
  const diff = expiryDateObj.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m`;
}


const isSubmittingProfileUpdate = ref<boolean>(false);
const handleProfileUpdate = async () => {
  isSubmittingProfileUpdate.value = true;
  try {
    const response = await axios.put("/api/user/profile", {
      userName: username.value,
      email: email.value,
    });
    if (currentLoggedInUser.value) {
      currentLoggedInUser.value.userName = response.data.user.userName;
      currentLoggedInUser.value.email = response.data.user.email;
    }
    isSubmittingProfileUpdate.value = false;
    profileUpdateBtnText.value = "Profile Updated!";
    setTimeout(() => {
      profileUpdateBtnText.value = "Update";
    }, 2000);
  } catch (error) {
    console.error("Error updating profile:", error);
    isSubmittingProfileUpdate.value = false;
  }
};

const isSubmittingPwUpdate = ref<boolean>(false);
const handlePwUpdate = async () => {
  isSubmittingPwUpdate.value = true;
  try {
    if (newPassword.value !== confirmNewPassword.value) {
      isSubmittingPwUpdate.value = false;
      return;
    }

    await axios.put("/api/user/password", {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
      confirmNewPassword: confirmNewPassword.value,
    });
    // Clear password fields after successful update
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
    isSubmittingPwUpdate.value = false;
    alert("Password updated successfully!");
  } catch (error) {
    if (isAxiosError(error)) {
      const errorMessage =
        error.response?.data.error || "Error updating password";
      if (errorMessage === "Current password is incorrect") {
        currentPasswordError.value = errorMessage;
      } else {
        passwordError.value = errorMessage || "Error updating password";
      }
    } else {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred while updating the password.");
    }

    isSubmittingPwUpdate.value = false;
  }
};
</script>

<style scoped></style>
