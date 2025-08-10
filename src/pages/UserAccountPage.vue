<template>
  <card-wrapper title="My Account" with-back-arrow>
    <div>
      <p v-if="currentLoggedInUser?.trialExpiresAt">
        Your trial expires in {{ daysTillExpiry }} days.
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
        <submit-button @click="handleProfileUpdate" :is-submitting="isSubmittingProfileUpdate">{{ profileUpdateBtnText }}</submit-button>
      </div>

      <hr />

      <div>
        <h2 class="text-lg">Change Password</h2>
        <div :class="formFieldClasses">
          <label for="current-password">Current Password</label>
          <input
            id="current-password"
            type="password"
            placeholder="Enter current password"
          />
        </div>
        <div :class="formFieldClasses">
          <label for="new-password">New Password</label>
          <input
            id="new-password"
            type="password"
            placeholder="Enter new password"
          />
        </div>
        <div :class="formFieldClasses">
          <label for="confirm-password">Confirm New Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
          />
          <submit-button :is-submitting="false">Update Password</submit-button>
        </div>
      </div>
    </div>
  </card-wrapper>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { currentLoggedInUser } from "../GlobalState";
import CardWrapper from "../components/reuseable/CardWrapper.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import axios from "axios";

const username = ref<string>(currentLoggedInUser.value?.userName || "");
const email = ref<string>(currentLoggedInUser.value?.email || "");

const formFieldClasses = "grid gap-2 text-start mb-2";

const daysTillExpiry = ref<number>(0);

const profileUpdateBtnText = ref<string>("Update");

onMounted(() => {
  calculateDaysTillExpiry();
});

const calculateDaysTillExpiry = () => {
  if (currentLoggedInUser.value?.trialExpiresAt) {
    const expiryDate = new Date(currentLoggedInUser.value.trialExpiresAt);
    const today = new Date();
    const timeDiff = expiryDate.getTime() - today.getTime();
    daysTillExpiry.value = Math.ceil(timeDiff / (1000 * 3600 * 24));
  } else {
    daysTillExpiry.value = 0;
  }
};

const isSubmittingProfileUpdate = ref<boolean>(false);
const handleProfileUpdate = async () => {
  isSubmittingProfileUpdate.value = true;
  try {
    const response = await axios.put("/api/user/profile", {
      userName: username.value,
      email: email.value,
    });
    if(currentLoggedInUser.value) {
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
</script>

<style scoped></style>
