<script setup>
import { computed, watch } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps({
    // modelValue: {
    //     type: [Array, Boolean],
    //     required: true,
    // },
    value: {
        default: null,
    },
    label: {
        type: String,
        default: null,
    },
});

const model = defineModel();


</script>

<template>
    <div class="flex items-center">
        <input
            :id="label"
            type="checkbox"
            :value="value"
            v-model="model"
            class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800"
        />
        <label :for="label" class="ml-2">{{ label }}</label>
    </div>
</template>
