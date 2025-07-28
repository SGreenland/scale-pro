<template>
    <div>
        <modal-wrapper :mask="false" :hasCloseButton="false">
            <h1 class="text-2xl font-bold mb-4">Sign Up</h1>
            <form class="text-left" @submit.prevent="handleSubmit">
                <div class="mb-4">
                    <label for="username" class="block text-sm font-medium text-gray-700">Email</label>
                    <input v-model="formData.email" type="email" id="username" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                </div>
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input v-model="formData.password" type="password" id="password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                </div>
                <div class="mb-4">
                    <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input v-model="formData.confirmPassword" type="password" id="confirm-password" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                </div>
                <button type="submit" class="w-full">Sign Up</button>
            </form>
        </modal-wrapper>
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import ModalWrapper from "../components/reuseable/ModalWrapper.vue";
import axios from "axios";

const formData = reactive({
    email: '',
    password: '',
    confirmPassword: ''
});

const handleSubmit = () => {
    axios.post('localhost:4000/signup', formData)
        .then(response => {
            console.log('Signup successful:', response.data);
            // Handle successful signup (e.g., redirect or show a success message)
        })
        .catch(error => {
            console.error('Signup error:', error);
            // Handle error (e.g., show an error message)
        });
};

</script>
