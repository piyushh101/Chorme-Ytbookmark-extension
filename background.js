chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ bookmarks: [] });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.com/watch')) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => console.error(err));
  }
});
