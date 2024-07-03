let currentIndex = 0;
let isForwardsAndBackwards = false;
let shouldLoop = false;
let scaleLength = 0;
let animationInterval = 1000;
let isRunning = false;
let lastFrameTime = 0;

self.onmessage = function (event) {
  const data = event.data;
  console.log('Received message:', data); // Debug logging

  if (data.type === "start") {
    currentIndex = 0;
    isForwardsAndBackwards = data.isForwardsAndBackwards;
    shouldLoop = data.shouldLoop;
    scaleLength = data.scaleLength;
    animationInterval = data.animationInterval;
    isRunning = true;
    lastFrameTime = Date.now();
    console.log('Starting sequence'); // Debug logging
    requestAnimationFrame(playSequence);
  } else if (data.type === "stop") {
    isRunning = false;
    console.log('Stopping sequence'); // Debug logging
  }
};

function playSequence(timestamp) {
  if (!isRunning) return;

  if (!timestamp) {
    timestamp = Date.now();
  }

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
    callback(Date.now());
  }, 1000 / 60); // Aim for 60 FPS
}
