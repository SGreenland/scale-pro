<template>
    <div class="flex flex-col gap-2 justify-center pb-2">
        <div>
            <div v-if="labels?.length" class="w-full flex justify-between">
                <span>{{ labels[0] }}</span>
                <span>{{ labels[1] }}</span>
            </div>
            <input
                type="range"
                :disabled="disabled"
                min="40"
                max="300"
                v-model="model"
                class="w-full h-2 bg-gray-200 rounded-full outline-none appearance-none"
            />
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    labels: Array,
    disabled: Boolean,
});

const model = defineModel();


</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3189b8;
    cursor: pointer;
    border-radius: 50%;
}
</style>
