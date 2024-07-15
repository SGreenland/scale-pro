<template>
    <div class="absolute px-3">
        <button type="button" @click="toggleDarkMode"
            class="mt-2 bg-opacity-0 bg-black group flex h-10 w-10 center-xy rounded-full    border-0 text-black dark:text-white dark:bg-black dark:bg-opacity-0 dark:hover:bg-stone-800 hover:bg-stone-200 focus:bg-stone-200 dark:focus:bg-stone-800 focus:outline-0"
            data-hs-theme-click-value="dark">
            <svg class="dark:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
            <svg class="hidden dark:block flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <circle fill="currentColor" stroke="none" cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
        </button> 
    </div>
</template>

<script setup lang="ts">
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
    } else {
    document.documentElement.classList.remove('dark')
    }
</script>

<script lang="ts">
export default {
    methods: {
        toggleDarkMode() {
            const element = document.documentElement
            if (element.classList.contains('dark')) {
                element.classList.remove('dark')
            } else {
                element.classList.add('dark')
            }
        },
    },
};


</script>