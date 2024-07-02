// audioWorker.js
let currentIndex = 0;
let isForwardsAndBackwards = false;
let shouldLoop = false;
let scaleLength = 0;
let animationInterval = 1000;
let timeoutId;

self.onmessage = function (event) {
  const data = event.data;

  if (data.type === "start") {
    currentIndex = 0;
    isForwardsAndBackwards = data.isForwardsAndBackwards;
    shouldLoop = data.shouldLoop;
    scaleLength = data.scaleLength;
    animationInterval = data.animationInterval;
    playSequence();
  } else if (data.type === "stop") {
    clearTimeout(timeoutId);
  }
};

function playSequence() {
  if (currentIndex < scaleLength) {
    postMessage({ type: "playNote", index: currentIndex });
    currentIndex++;
  } else if (isForwardsAndBackwards && currentIndex < scaleLength * 2 - 1) {
    const reversedIndex = currentIndex - scaleLength;
    postMessage({ type: "playNote", index: scaleLength - 2 - reversedIndex });
    currentIndex++;
  } else if (shouldLoop) {
    currentIndex = 0;
  } else {
    postMessage({ type: "done" });
    return;
  }

  timeoutId = setTimeout(playSequence, animationInterval);
}
