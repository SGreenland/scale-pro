<template>
  <div
    class="flex-col h-fit p-4 pt-2 md:w-3/4 w-[98%] mt-4 m-auto rounded-lg shadow-md dark:shadow-gray-500 bg-white dark:bg-gray-800/50"
    :class="`lg:w-${width} max-w-[${maxWidth}]`"
  >
  <div class="flex relative items-center pb-3">
        <font-awesome-icon
          v-if="withBackArrow"
          role="button"
          @click="goBack"
          class="cursor-pointer ps-1"
          :icon="faArrowLeft"
        ></font-awesome-icon>
        <h1 class="text-2xl w-fit left-0 right-0 mx-auto" :class="{'mb-4' : !titleRule}">{{ title }}</h1>
      </div>
      <hr v-if="titleRule"/>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => {
  router.back();
};
withDefaults(
  defineProps<{
    title?: string;
    withBackArrow?: boolean;
    width?: '1/2' | '2/3' | '3/4' | 'full';
    maxWidth?: string;
    titleRule?: boolean;
  }>(),
  {
    title: '',
    withBackArrow: false,
    width: '1/2',
    maxWidth: '900px',
    titleRule: true,
  }
);
</script>
