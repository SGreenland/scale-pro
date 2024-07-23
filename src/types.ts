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

interface PlayBackOptions {
    shouldLoop: boolean;
    isRoundTrip: boolean;
}

export type { Note, Scales, PresetNoteOrders, PlayBackOptions };


