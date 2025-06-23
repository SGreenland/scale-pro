import { PitchDetector } from "pitchy";
import { ref } from "vue";

export function usePitchTracker(audioContext: AudioContext, bufferSize = 2048) {
  const pitchData = ref<
    { pitch: number; clarity: number; time: number; volume: number }[]
  >([]);
  const detector = PitchDetector.forFloat32Array(bufferSize);
  detector.minVolumeAbsolute = 0.05;
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

    const rms = Math.sqrt(
      micBuffer.reduce((sum, sample) => sum + sample ** 2, 0) / micBuffer.length
    );

    // Optional: scale RMS to something like 0–1
    const volume = rms;

    const [pitch, clarity] = detector.findPitch(
      micBuffer,
      audioContext.sampleRate
    );
    if (clarity > 0.8 && pitch > 85) {
      pitchData.value.push({
        pitch,
        clarity,
        time: audioContext.currentTime,
        volume: volume,
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
