import { computed, reactive, ref, watch} from "vue";
import { guitarScaleStringPatterns } from "./NotesAndScales";
import { PlayBackOptions, ScaleConfig, WorkoutConfig } from "./types";
import { Settings } from "@shared/types";
import scaleManipulator from "./utils/scaleManipulator";
import { useSessionStorage } from "./composables/useSessionStorage";

const { getScale } = scaleManipulator();

export const currentLoggedInUser = useSessionStorage<{ id: string; userName: string, email: string, trialExpiresAt: Date } | null>('user', null);

export const hasUserJustSignedUp = ref(false);

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
  isRoundTrip: false,
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

//settings
export const settings = reactive<Settings>({
  startingRootNote: "C3",
  startingScale: "Major",
  theme: 'auto',
  gridType: 'Piano roll',
  loopGap: 'None',
  loopGapCustom: 1,
  autoShuffle: false,
  minDetectionVolume: 'normal',
  pitchToleranceLevel: 'standard',
});

export const scaleConfig = reactive<ScaleConfig>({
  selectedScale: settings.startingScale,
  selectedNote: settings.startingRootNote,
  noteOrder: computedNoteOrder.value,
  currentGtrPositions: [],
});

export const tempo = ref(120);

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

watch(scaleToDisplay, (newScale, oldScale) => {
  if (newScale.length !== oldScale.length) {
    // Reset the note order if the scale length changes
    scaleConfig.noteOrder = null;
  }
})

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
  switch (settings.loopGap) {
    case 'None':
      return 0;
    case 'Auto':
      return scaleToDisplay.value.length === 4 ? 2 : 3;
    case 'Custom':
      return settings.loopGapCustom * 2 + 1;
    default:
      return 1;
  }
});


export const computedTheme = computed(() => {
  return settings.theme === 'auto' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : settings.theme;
});

watch(() => settings.theme, () => {
  const html = document.documentElement;

  if (computedTheme.value === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}, { immediate: true });



const minDetectionVolumeMap = {
  sensitive: 0.03,
  normal: 0.06,
};

const maxCentsMap = {
  loose: 75,
  standard: 50,
  precise: 25,
};

export const computedMinDetectionVolume = computed(() => {
  return minDetectionVolumeMap[settings.minDetectionVolume];
});

export const computedMaxCents = computed(() => {
  return maxCentsMap[settings.pitchToleranceLevel];
});

