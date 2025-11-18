import { PitchDetector } from "pitchy";
import { ref, watch } from "vue";
import { currentSettings, minDetectionVolumeMap } from "../GlobalState";
import { last } from "lodash";

export function usePitchTracker(audioContext: AudioContext, bufferSize = 2048) {
  const pitchData = ref<
    { pitch: number; clarity: number; time: number; volume: number }[]
  >([]);
  const detector = PitchDetector.forFloat32Array(bufferSize);
  detector.minVolumeAbsolute = 0.06;
  const micBuffer = new Float32Array(bufferSize);
  let analyser: AnalyserNode | null = null;
  const animationId: { value: number | null } = ref(null);

  const lastUpdated = ref<number | null>(null);
  const isTracking = ref(false);

  watch(() => currentSettings.value.minDetectionVolume, (newValue) => {
    if (detector && newValue) {
      detector.minVolumeAbsolute = minDetectionVolumeMap[newValue];
    };
  }, { deep: true, immediate: true });

  async function startTracking() {
    isTracking.value = true;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const micSource = audioContext.createMediaStreamSource(stream);

    analyser = audioContext.createAnalyser();
    analyser.fftSize = bufferSize;
    micSource.connect(analyser);

    animationId.value = requestAnimationFrame(update);
  }

  function stopTracking() {
    isTracking.value = false;
    if (animationId) cancelAnimationFrame(animationId.value!);
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
    if (clarity > 0.9 && pitch > 65) {
      lastUpdated.value = audioContext.currentTime;
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

    animationId.value = requestAnimationFrame(update);
  }

  // watch pitch data to auto stop if setting is enabled
  watch(() => animationId.value, () => {
    if (!currentSettings.value.autoStopPitchTracking) return;
    if (animationId.value !== null) {
      const lastPoint = last(pitchData.value);
      if (lastPoint && lastUpdated.value) {
        const timeSinceLastUpdate = audioContext.currentTime - lastUpdated.value;
        if (timeSinceLastUpdate > 1.5) {
          stopTracking();
        }
      }
    }
  });


  return {
    pitchData,
    startTracking,
    stopTracking,
    isTracking
  };
}
