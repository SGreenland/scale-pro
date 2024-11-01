import { reactive, Ref, ref, computed, watch } from "vue";
import { PresetNoteOrders, PlayBackOptions, WorkoutConfig, Note, ScaleConfig } from "./types";
import scaleManipulator from "./utils/scaleManipulator";
import ScaleConfig from "./components/ScaleConfig.vue";

const { getScale } = scaleManipulator();

export const presetNoteOrders = reactive({
  presets8: [
    [1, 3, 5, 7, 2, 4, 6, 8],
    [1, 6, 2, 4, 3, 7, 5, 8],
    [1, 5, 3, 7, 2, 6, 4, 8],
    [1, 4, 2, 6, 3, 7, 5, 8],
    [1, 3, 5, 7, 8, 6, 4, 2],
    [1, 6, 2, 4, 5, 7, 3, 8],
    [1, 5, 3, 7, 8, 6, 4, 2],
    [1, 4, 2, 6, 8, 7, 5, 3],
  ],
  presets6: [
    [1, 3, 5, 2, 4, 6],
    [1, 6, 2, 4, 3, 5],
    [1, 5, 3, 2, 4, 6],
    [1, 4, 2, 3, 5, 6],
    [1, 3, 5, 6, 4, 2],
    [1, 6, 2, 5, 3, 4],
    [1, 5, 3, 6, 4, 2],
    [1, 4, 2, 5, 3, 6],
  ],
});

export const playBackOptions = reactive<PlayBackOptions>({
  shouldLoop: false,
  isRoundTrip: true,
});

export const workoutMode = ref(false);

const computedNoteOrder = computed(() => {
  return !workoutMode.value ? practiceNoteOrder.value : workoutNoteOrder.value;
});

export const practiceNoteOrder = computed({
  get: () => localStorage.getItem('practiceNoteOrder') ? JSON.parse(localStorage.getItem('practiceNoteOrder')!) : null,
  set: (value: number[]|null) => {
    localStorage.setItem('practiceNoteOrder', JSON.stringify(value));
  },
})

export const workoutNoteOrder = computed({
  get: () => localStorage.getItem('workoutNoteOrder') ? JSON.parse(localStorage.getItem('workoutNoteOrder')!) : null,
  set: (value: number[]|null) => {
    localStorage.setItem('workoutNoteOrder', JSON.stringify(value));
  },
})

export const scaleConfig = reactive<ScaleConfig>({
  selectedScale: "Major",
  selectedNote: "C4",
  noteOrder: computedNoteOrder.value,
});

export const tempo = ref('120');

export const selectedPreset = ref<number[]|undefined>();

export const scaleToDisplay =  computed(
  () => getScale(scaleConfig.selectedNote, scaleConfig.selectedScale, scaleConfig.noteOrder)
);

export const workoutConfig = reactive<WorkoutConfig>({
  startNote: "C4",
  endNote: "D4",
  scales: ["Major"],
  roundTrip: true,
  multiScale: false,
  noteOrder: null,
});

