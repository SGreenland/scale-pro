<template>
  <ModalWrapper @close="$emit('close')">
    <div class="text-center">
      <h2 class="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        🎤 Pitch Tracking Info
      </h2>

      <p class="text-lg text-gray-800 dark:text-gray-200 mb-4">
        This feature tracks your pitch in real-time, providing feedback on your
        singing or playing accuracy.
      </p>
      <p class="text-lg text-gray-800 dark:text-gray-200 mb-4">
        Click <strong>Start Pitch Tracking</strong> to begin. (You may need to
        grant microphone access.)
      </p>
      <div class="bg-yellow text-black rounded-xl p-4 mb-6 text-left">
        <b>Tip: </b>
        <i
          >Listen to the scale playback first, then try to match the pitch as
          closely as possible. You can sing or play at any speed.</i
        >
      </div>

      <p class="text-lg text-gray-800 dark:text-gray-200 mb-6">
        When you’re finished, click <strong>Stop Pitch Tracking</strong> to see
        your feedback.
      </p>

      <!-- FAQ Accordion -->
      <div class="text-left space-y-3">
        <details class="border rounded-lg p-3 cursor-pointer">
          <summary class="font-semibold text-gray-800 dark:text-white">
            ❓ I don’t see any pitch data
          </summary>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Make sure you’ve granted microphone access and are close enough to
            your device. If you sing quietly or play softly, try adjusting the
            volume detection in settings to 'Sensitive'.
          </p>
        </details>

        <details class="border rounded-lg p-3 cursor-pointer">
          <summary class="font-semibold text-gray-800 dark:text-white">
            ❓ The graph looks messy or jumpy
          </summary>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            This may happen if the note isn’t held steadily, or if there’s
            background noise. Sighing or exhaling can also cause erratic
            readings. Try singing or playing more smoothly, or increase the
            pitch tolerance in the settings.
          </p>
        </details>

        <details class="border rounded-lg p-3 cursor-pointer">
          <summary class="font-semibold text-gray-800 dark:text-white">
            ❓ My accuracy score seems too low
          </summary>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Even small pitch shifts can affect the score. Check that you're
            singing or playing in the correct octave and consider lowering the
            difficulty level for more leniency.
          </p>
        </details>

        <details class="border rounded-lg p-3 cursor-pointer">
          <summary class="font-semibold text-gray-800 dark:text-white">
            ❓ Can I sing faster or slower?
          </summary>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Yes! The system is tempo-independent—you can sing or play the scale
            at any speed. Try to keep the pitch steady on each note for better
            results.
          </p>
        </details>
      </div>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from "./reuseable/ModalWrapper.vue";
</script>
