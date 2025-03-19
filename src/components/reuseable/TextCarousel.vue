<template>
    <div class="flex justify-between items-center h-10 w-3/4 m-auto">
        <!--chevron left-->
        <font-awesome-icon role="button" @click="shiftLeft" :icon="faChevronLeft"></font-awesome-icon>
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
        <font-awesome-icon role="button" @click="shiftRight" :icon="faChevronRight"></font-awesome-icon>


    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
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