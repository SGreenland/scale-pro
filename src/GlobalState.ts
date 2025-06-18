import { computed, reactive, ref, watch } from "vue";
import { guitarScaleStringPatterns } from "./NotesAndScales";
import { LoopGapOption, PlayBackOptions, ScaleConfig, WorkoutConfig } from "./types";
import scaleManipulator from "./utils/scaleManipulator";

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
  presets5: [
    [1, 3, 2, 4, 5],
    [1, 4, 2, 3, 5],
    [1, 3, 4, 2, 5],
    [1, 4, 3, 2, 5],
  ],
  presets4: [
    [1, 3, 2, 4],
    [1, 4, 2, 3],
    [1, 3, 4, 2],
    [1, 4, 3, 2],
  ],

});

export const isLoadingAudio = ref(true);

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
  selectedScale: "Major (1-5)",
  selectedNote: "C3",
  noteOrder: computedNoteOrder.value,
  currentGtrPositions: [],
});

export const tempo = ref('120');

export const selectedGridType = ref<'Guitar tab'|'Piano roll'>('Piano roll');

export const selectedPreset = ref<number[]|undefined>();

export const scaleToDisplay =  computed(
  () => getScale(scaleConfig.selectedNote, scaleConfig.selectedScale, scaleConfig.noteOrder, scaleConfig.currentGtrPositions)
);

export const validGtrPatternsForCurrentScale = computed(() => {
    return guitarScaleStringPatterns[scaleConfig.selectedScale].filter(pattern => {
        return pattern.every((stringNumber, noteIndex) => {
            const note = scaleToDisplay.value[noteIndex];
            return note.guitarPositions.some(pos => pos.string === stringNumber);
        });
    });
  });

watch(
  () => [scaleConfig.selectedScale, scaleConfig.selectedNote],
  () => {
    // Reset current guitar positions when scale or note changes
    scaleConfig.currentGtrPositions = []
  }
);

export const workoutConfig = reactive<WorkoutConfig>({
  startNote: "C4",
  endNote: "D4",
  scales: ["Major"],
  roundTrip: true,
  multiScale: false,
  noteOrder: null,
});

export const computedLoopGap = computed(() => {
  // refactor to switch statement
  switch (loopGap.value) {
    case 'None':
      return 0;
    case 'Auto':
      return scaleToDisplay.value.length === 4 ? 2 : 3;
    case 'Custom':
      return loopGapCustom.value * 2 + 1;
    default:
      return 1;
  }
});

export const loopGap = ref<LoopGapOption>('None');
export const loopGapCustom = ref<number>(1);
export const autoShuffle = ref<boolean>(false);

