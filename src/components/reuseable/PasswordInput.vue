<template>
  <div>
    <input required :placeholder="placeholder" class="w-full mb-2" type="password" id="password" v-model="model" />
    <ul v-if="model.length" class="text-sm">
        <li :class="{'text-red-500': !model || model.length < 8, 'text-green-500 plus-tick': model && model.length >= 8}">
            {{ validationErrors?.minLength }}
        </li>
        <li :class="{'text-red-500': !model || !/\d/.test(model), 'text-green-500 plus-tick': model && /\d/.test(model)}">
            {{ validationErrors?.containsNumber }}
        </li>
        <li :class="{'text-red-500': !model || !/[A-Z]/.test(model), 'text-green-500 plus-tick': model && /[A-Z]/.test(model)}">
            {{ validationErrors?.containsUppercase }}
        </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
const model = defineModel<string>({
  default: "",
});

withDefaults(defineProps<{
  placeholder?: string;
}>(), {
  placeholder: "Enter password",
});

interface ValidationErrors {
  minLength: string;
  containsNumber: string;
  containsUppercase: string;
}


const validationErrors = reactive<ValidationErrors>({
  minLength: "Password must be at least 8 characters long",
  containsNumber: "Password must contain at least one number",
  containsUppercase: "Password must contain at least one uppercase letter",
});
</script>
