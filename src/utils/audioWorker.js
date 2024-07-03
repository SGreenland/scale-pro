let currentIndex = 0;
let isForwardsAndBackwards = false;
let shouldLoop = false;
let scaleLength = 0;
let animationInterval = 1000;
let isRunning = false;

self.onmessage = function (event) {
  const data = event.data;

  if (data.type === "start") {
    currentIndex = 0;
    isForwardsAndBackwards = data.isForwardsAndBackwards;
    shouldLoop = data.shouldLoop;
    scaleLength = data.scaleLength;
    animationInterval = data.animationInterval;
    isRunning = true;
    lastFrameTime = performance.now();
    playSequence(lastFrameTime);
  } else if (data.type === "stop") {
    isRunning = false;
  }
};

function playSequence(timestamp) {
  if (!isRunning) return;

  const elapsed = timestamp - lastFrameTime;

  if (elapsed >= animationInterval) {
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
    lastFrameTime = timestamp;
  }

  if (isRunning) {
    setTimeout(() => requestAnimationFrame(playSequence), 0);
  }
}

function requestAnimationFrame(callback) {
  setTimeout(() => {
    callback(performance.now());
  }, 1000 / 60); // Aim for 60 FPS
}
