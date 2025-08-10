<template>
    <div>
        <modal-wrapper :mask="false" :hasCloseButton="false">
            <h1 class="text-2xl font-bold mb-4">Login</h1>
            <form class="text-left" @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model="formData.email" type="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                    <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email }}</span>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="formData.password" type="password" id="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                    <span v-if="errors.password" class="text-red-500 text-sm">{{ errors.password }}</span>
                </div>
                <submit-button @click="handleSubmit" :isSubmitting="isSubmitting">Login</submit-button>
            </form>
        </modal-wrapper>
    </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { reactive, ref } from "vue";
import ModalWrapper from "../components/reuseable/ModalWrapper.vue";
import SubmitButton from "../components/reuseable/SubmitButton.vue";
import { currentLoggedInUser } from "../GlobalState";

const formData = reactive({
    email: '',
    password: ''
});

const errors = reactive({
    email: '',
    password: ''
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;
        const response = await axios.post('/api/login', formData);
        if (response.data.token && response.data.user) {
            //set read-only cookie with token
            document.cookie = `token=${response.data.token}; path=/; secure; HttpOnly samesite=strict`;
            // Set the current logged-in user
            currentLoggedInUser.value = {
                id: response.data.user.id,
                userName: response.data.user.userName,
                email: response.data.user.email,
                trialExpiresAt: response.data.user.trialExpiresAt
            };
            // Redirect to home
            window.location.href = '/';
        } else {
            isSubmitting.value = false;
            console.error('Login failed:', response.data.message);
        }
    } catch (error: any) {
        const errorData = JSON.parse(error.response?.data?.error) || {};
        errors.email = errorData.email || '';
        errors.password = errorData.password || '';
        if(!errors.email && !errors.password) {
            errors.email = 'An unexpected error occurred. Please try again.';
        }
        isSubmitting.value = false;
    }
};



</script>
