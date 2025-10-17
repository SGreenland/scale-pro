import { prisma } from "../prisma";

const notePatterns: any[] = [
    { name: 'Major', pattern: [0, 2, 4, 5, 7, 9, 11, 12], type: 'scale', isPremium: false },
    { name: 'Major (1-5)', pattern: [0, 2, 4, 5, 7], type: 'scale', isPremium: false },
    { name: 'Natural Minor', pattern: [0, 2, 3, 5, 7, 8, 10, 12], type: 'scale', isPremium: false },
    { name: 'Harmonic Minor', pattern: [0, 2, 3, 5, 7, 8, 11, 12], type: 'scale', isPremium: true },
    { name: 'Minor Pentatonic', pattern: [0, 3, 5, 7, 10, 12], type: 'scale', isPremium: true },
    { name: 'Major Pentatonic', pattern: [0, 2, 4, 7, 9, 12], type: 'scale', isPremium: true },
    { name: 'Whole Tone', pattern: [0, 2, 4, 6, 8, 10, 12], type: 'scale', isPremium: true },
    { name: 'Diminished', pattern: [0, 2, 3, 5, 6, 8, 9, 11, 12], type: 'scale', isPremium: true },
    { name: 'Blues Scale', pattern: [0, 3, 5, 6, 7, 10, 12], type: 'scale', isPremium: true },
    { name: 'Phrygian', pattern: [0, 1, 3, 5, 7, 8, 10, 12], type: 'scale', isPremium: true },
    { name: 'Lydian', pattern: [0, 2, 4, 6, 7, 9, 11, 12], type: 'scale', isPremium: true },
    { name: 'Mixolydian', pattern: [0, 2, 4, 5, 7, 9, 10, 12], type: 'scale', isPremium: true },
    { name: 'Locrian', pattern: [0, 1, 3, 5, 6, 8, 10, 12], type: 'scale', isPremium: true },
    { name: 'Major Arp', pattern: [0, 4, 7, 12], type: 'arpeggio', isPremium: false },
    { name: 'Minor Arp', pattern: [0, 3, 7, 12], type: 'arpeggio', isPremium: false },
    { name: 'Major 7 Arp', pattern: [0, 4, 7, 11, 12], type: 'arpeggio', isPremium: true },
    { name: 'Minor 7 Arp', pattern: [0, 3, 7, 10, 12], type: 'arpeggio', isPremium: true },
    { name: 'Diminished Arp', pattern: [0, 3, 6, 12], type: 'arpeggio', isPremium: true },
    { name: 'Augmented Arp', pattern: [0, 4, 8, 12], type: 'arpeggio', isPremium: true },
    { name: 'Major 3rd', pattern: [0, 4], type: 'interval', isPremium: false },
    { name: 'Minor 3rd', pattern: [0, 3], type: 'interval', isPremium: false },
    { name: 'Perfect 4th', pattern: [0, 5], type: 'interval', isPremium: true},
    { name: 'Perfect 5th', pattern: [0, 7], type: 'interval', isPremium: false },

    { name: 'Major 6th', pattern: [0, 9], type: 'interval', isPremium: true },
    { name: 'Minor 6th', pattern: [0, 8], type: 'interval', isPremium: true },
    { name: 'Major 7th', pattern: [0, 11], type: 'interval', isPremium: true },
    { name: 'Minor 7th', pattern: [0, 10], type: 'interval', isPremium: true },
    { name: 'Octave', pattern: [0, 12], type: 'interval', isPremium: false },
    { name: 'Diminished 5th', pattern: [0, 6], type: 'interval', isPremium: true },
    { name: 'Augmented 5th', pattern: [0, 8], type: 'interval', isPremium: true },
];

const lockedPatterns: string[] = ['Whole Tone', 'Diminished', 'Major Pentatonic', 'Blues Scale', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian', 'Diminished 5th', 'Augmented 5th'];

async function main() {
    for (const np of notePatterns) {
        await prisma.notePattern.upsert({
            where: { name: np.name },
            update: {},
            create: {
                name: np.name,
                pattern: np.pattern,
                type: np.type,
                isPremium: np.isPremium,
                isLocked: lockedPatterns.includes(np.name) ? true : false,
            },
        });
    }
    console.log('Note patterns seeded/updated successfully.');
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })