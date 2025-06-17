import { ref, onMounted, onBeforeUnmount } from 'vue';
import { PitchDetector } from 'pitchy';

export function usePitchTracker(audioContext: AudioContext, bufferSize = 2048) {
  const pitchData = ref<{ pitch: number; clarity: number; time: number }[]>([]);
  const detector = PitchDetector.forFloat32Array(bufferSize);
  detector.minVolumeAbsolute = 0.08;
  const micBuffer = new Float32Array(bufferSize);
  let analyser: AnalyserNode | null = null;
  let animationId: number | null = null;

  async function startTracking() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const micSource = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = bufferSize;
    micSource.connect(analyser);

    animationId = requestAnimationFrame(update);
  }

  function stopTracking() {
    if (animationId) cancelAnimationFrame(animationId);
  }

  function update() {
    if (!analyser) return;
    analyser.getFloatTimeDomainData(micBuffer);

    console.log('Analyzing pitch...');

    const [pitch, clarity] = detector.findPitch(micBuffer, audioContext.sampleRate);
    if (clarity > 0.8 && pitch > 40) {
      pitchData.value.push({
        pitch,
        clarity,
        time: audioContext.currentTime,
      });

      if (pitchData.value.length > 2000) {
        pitchData.value.shift(); // trim
      }
    }

    animationId = requestAnimationFrame(update);
  }

  // onBeforeUnmount(() => {
  //   stopTracking();
  // });

  return {
    pitchData,
    startTracking,
    stopTracking,
  };
}
