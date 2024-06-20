function getCurrentTimestamp() {
  const video = document.querySelector('video');
  if (video) {
    return Math.floor(video.currentTime);
  }
  return 0;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTimestamp') {
    const timestamp = getCurrentTimestamp();
    sendResponse({ timestamp: timestamp });
  }
});
