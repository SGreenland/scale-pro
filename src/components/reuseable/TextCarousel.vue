<template>
    <div class="flex justify-between items-center mb-2 w-full px-4 m-auto">
        <!--chevron left-->
        <div role="button" @click="shiftLeft" class="size-6 flex items-center justify-center">
            <font-awesome-icon :icon="faChevronLeft"></font-awesome-icon>
        </div>
        <div class="flex space-x-2 font-medium">
            <span
                v-for="(item, index) in itemsRef"
                :key="index"
                :class="{'hidden': index !== 0}"
            >
                {{ item }}
            </span>
        </div>
        <!--chevron right-->
        <div role="button" @click="shiftRight" class="size-6 flex items-center justify-center">
            <font-awesome-icon :icon="faChevronRight"></font-awesome-icon>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const props = defineProps<{
    items: string[];
}>();

const itemsRef = ref<string[]>(props.items)

const shiftRight = () => {
    itemsRef.value.push(itemsRef.value.shift() as string);
};

const shiftLeft = () => {
    itemsRef.value.unshift(itemsRef.value.pop() as string);
};

defineExpose({ itemsRef });

</script>