<template>
  <div
    class="flex-col h-fit p-5 lg:w-1/2 md:w-2/3 w-full mt-4 m-auto rounded-lg shadow-md dark:shadow-gray-500 bg-white dark:bg-gray-800/50"
  >
  <div class="flex relative items-center pb-3">
        <font-awesome-icon
          v-if="withBackArrow"
          role="button"
          @click="goBack"
          class="cursor-pointer ps-1"
          :icon="faArrowLeft"
        ></font-awesome-icon>
        <h1 class="text-2xl absolute w-fit left-0 right-0 m-auto">{{ title }}</h1>
      </div>
      <hr />
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
  }>(),
  {
    title: '',
    withBackArrow: false,
  }
);
</script>
