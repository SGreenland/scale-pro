import { Note } from "../types";


export default function useReorderNotes() {

    function mapPositions(notes: Note[]) {
        return notes.map(note => note.position);
    };
    function reverse(notes: Note[]) {
        return mapPositions(notes).reverse();
    }

    function shuffle(notes: Note[]) {
        return mapPositions(notes).sort(() => Math.random() - 0.5);
    }

    function reorder(notes: Note[], order: number[] | null) {
        if (!order) return notes;
        const orderedNotes = order.map(pos => notes.find(note => note.position === pos));
        return orderedNotes.filter(note => note !== undefined) as Note[];
    }

    return {
        mapPositions,
        reverse,
        shuffle,
        reorder
    };
}