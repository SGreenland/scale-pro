interface Note {
    name: string;
    audioSrc: string;
}

interface Scales {
    'Major': number[];
    'Minor': number[];
    'Harmonic Minor': number[];
    'Minor Pentatonic': number[];
}

export type { Note, Scales };


