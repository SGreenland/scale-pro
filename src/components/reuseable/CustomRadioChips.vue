<template>
    <div>
        <div class="flex flex-wrap gap-2">
            <label
                v-for="option in options"
                :key="option"
                class="cursor-pointer flex items-center gap-2"
            >
                <input
                    type="radio"
                    :value="option"
                    v-model="modelValue"
                    class="hidden peer"
                />
                <span
                    class="inline-flex items-center justify-center w-fit h-8 px-2 rounded-2xl border border-gray-300 peer-checked:bg-blue-500 peer-checked:text-white"
                >
                    {{ option }}
                </span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    options: string[];
}>();

const modelValue = defineModel<string>({
    type: String,
    default: "",
});

</script>

<style scoped>

</style>