interface Note {
    name: string;
    interval: number;
    audioSrc: string;
}

interface Scales {
    'Major': number[];
    'Major (1-5)': number[];
    'Minor': number[];
    'Harmonic Minor': number[];
    'Minor Pentatonic': number[];
    'Major Arpeggio': number[];
    'Minor Arpeggio': number[];
    'Diminished Arpeggio': number[];
    'Augmented Arpeggio': number[];
}

interface ScaleConfig {
    selectedScale: keyof Scales;
    selectedNote: string;
    noteOrder: number[] | null;
}


interface PresetNoteOrders {
    presets8: number[];
    presets6: number[];
}

interface PlayBackOptions {
    shouldLoop: boolean;
    isRoundTrip: boolean;
}

interface WorkoutConfig {
    startNote: string;
    endNote: string;
    // scale: keyof Scales;
    roundTrip: boolean;
    multiScale: boolean;
    scales: string[];
    noteOrder: number[] | null;
}

export type { Note, Scales, PresetNoteOrders, PlayBackOptions, WorkoutConfig, ScaleConfig};


