<template>
  <div>
    <input required :placeholder="placeholder" class="w-full mb-2" type="password" v-model="model" />
    <ul v-if="model.length" class="text-sm">
        <li :class="{'text-red-500': !passwordsMatch, 'text-green-500 plus-tick': passwordsMatch}">
            {{ passwordsMatch ? "Passwords match!" : "Passwords do not match" }}
        </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {  computed } from "vue";
const model = defineModel<string>({
  default: "",
});

const passwordsMatch = computed(() => {
  return model.value === props.passwordToMatch;
});


const props = withDefaults(defineProps<{
  placeholder?: string;
  passwordToMatch: string;
}>(), {
  placeholder: "Enter password",
  passwordToMatch: "",
});


</script>
