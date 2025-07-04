<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(defineProps<{
    align?: 'left' | 'right' | 'center';
    width?: string;
    contentClasses?: string;
    closeContentOnClick?: boolean;
    marginClass?: string;
    positionClass?: string;
}>(), {
    align: 'right',
    width: '48',
    closeContentOnClick: false,
    marginClass: 'mt-1',
});

const closeOnEscape = (e: KeyboardEvent) => {
    if (open.value && e.key === 'Escape') {
        open.value = false;
    }
};

onMounted(() => document.addEventListener('keydown', closeOnEscape));
onUnmounted(() => document.removeEventListener('keydown', closeOnEscape));

const widthClass = computed(() => {
    return props.width ? `w-${props.width}` : 'w-48';
});

const alignmentClasses = computed(() => {
    if (props.align === 'left') {
        return 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (props.align === 'right') {
        return 'ltr:origin-top-right rtl:origin-top-left end-0';
    } else {
        return 'origin-top';
    }
});

const open = ref(false);

defineExpose({ open });
</script>

<template>
    <div class="relative">
        <div @click="open = !open">
            <slot name="trigger" />
        </div>

        <!-- Full Screen Dropdown Overlay -->
        <div v-show="open" class="fixed inset-0 z-40" @click="open = false"></div>

        <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-show="open"
                class="absolute z-50 rounded-md shadow-lg"
                :class="[widthClass, alignmentClasses, marginClass, positionClass]"
                style="display: none"
                @click="closeContentOnClick && (open = false)"
            >
                <div :class="'rounded-md ring-1 ring-black ring-opacity-5 max-h-[60vh] overflow-auto py-1 bg-white dark:bg-gray-700 ' + contentClasses">
                    <slot name="content" />
                </div>
            </div>
        </Transition>
    </div>
</template>
