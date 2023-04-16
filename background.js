chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.create({ url: 'https://curated-ai.space/dashboard' });
});

console.log('Welcome to CuratedAI!');

chrome.browserAction.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: `https://curated-ai.space/dashboard?title=${tab.title}&url=${tab.url}`,
  });
});

chrome.tabs.onUpdated.addListener((tabId, _, tab) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.status !== "complete") return;
    if (!tab?.url) return;
    if (!tab.url.includes('curated')) {
      return;
    }
    chrome.tabs.executeScript(tabId, {
      file: '/id.js',
    });
  });
});

chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
  console.debug("RECEIVED", request);
  switch (request.method) {
    case 'SET':
      chrome.storage.sync.set(request.body, () => {});
      sendResponse({ success: true });
      break;
    default:
      throw new Error(`Invalid cmd ${request.method}`);
  }
});
