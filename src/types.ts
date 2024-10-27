interface Note {
    name: string;
    interval: number;
    audioSrc: string;
}

interface Scales {
    'Major': number[];
    'Minor': number[];
    'Harmonic Minor': number[];
    'Minor Pentatonic': number[];
}

interface ScaleConfig {
    selectedScale: keyof Scales;
    selectedNote: string;
    noteOrder: number[] | null;
}


interface PresetNoteOrders {
    presets8: string[];
    presets6: string[];
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
    presetOrder?: string;
}

export type { Note, Scales, PresetNoteOrders, PlayBackOptions, WorkoutConfig, ScaleConfig};


