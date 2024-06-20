document.addEventListener('DOMContentLoaded', () => {
  const bookmarkBtn = document.getElementById('bookmark-btn');
  const bookmarksList = document.getElementById('bookmarks-list');

  bookmarkBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // Inject content script if not already injected
      chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        files: ['content.js']
      }, () => {
        // Send message to content script after injection
        chrome.tabs.sendMessage(activeTab.id, { action: 'getTimestamp' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
          }
          if (response && response.timestamp !== undefined) {
            const timestamp = response.timestamp;
            chrome.storage.sync.get({ bookmarks: [] }, (data) => {
              const bookmarks = data.bookmarks;
              const bookmark = { url: activeTab.url, timestamp: timestamp };
              bookmarks.push(bookmark);
              chrome.storage.sync.set({ bookmarks: bookmarks }, () => {
                displayBookmarks(bookmarks);
              });
            });
          } else {
            console.error("Failed to get the timestamp. Make sure the content script is loaded.");
          }
        });
      });
    });
  });

  function displayBookmarks(bookmarks) {
    bookmarksList.innerHTML = '';
    bookmarks.forEach((bookmark, index) => {
      const li = document.createElement('li');
      const time = new Date(bookmark.timestamp * 1000).toISOString().substr(11, 8);
      li.textContent = `${bookmark.url} - ${time}`;
      li.addEventListener('click', () => {
        chrome.tabs.create({ url: `${bookmark.url}&t=${bookmark.timestamp}` });
      });
      bookmarksList.appendChild(li);
    });
  }

  chrome.storage.sync.get({ bookmarks: [] }, (data) => {
    displayBookmarks(data.bookmarks);
  });
});
