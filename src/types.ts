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


interface PresetNoteOrders {
    presets8: string[];
    presets6: string[];
}

export type { Note, Scales, PresetNoteOrders };


