<template>
  <select style="max-height: 200px;" id="note" v-model="modelValue">
    <option v-for="(note, index) in availableRootNotes" :key="index">
      {{ note.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { notes } from "../NotesAndScales";
import { settings } from "../GlobalState";
// root notes can only be up to C6
// @ts-ignore
const rootNotes = notes.filter((note, index) => index <= 48);

const availableRootNotes = computed(() => {
  if (settings.gridType === "Guitar tab") {
    const rootNotesCopy = [...rootNotes];
    return rootNotesCopy.splice(4, 30);
  } else {
    return rootNotes;
  }
});

const modelValue = defineModel<string>({
  type: String,
});

defineExpose({ availableRootNotes });
</script>

<style scoped></style>
