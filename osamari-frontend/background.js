chrome.action.onClicked.addListener((tab) => {
  // Inject local Turndown library first
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["turndown.js"]
  }, () => {
    // Then run the extraction function
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractAndSendContent
    });
  });
});

async function extractAndSendContent() {
  // Wait for Turndown to be available
  function waitForTurndown() {
    return new Promise(resolve => {
      if (window.TurndownService) return resolve();
      const interval = setInterval(() => {
        if (window.TurndownService) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }
  await waitForTurndown();

  const title = document.title;
  const bodyHTML = document.body.innerHTML;

  // Convert to Markdown using Turndown
  const turndownService = new window.TurndownService();
  const markdown = turndownService.turndown(`<h1>${title}</h1>${bodyHTML}`);

  // Send to backend
  await fetch('http://localhost:3000/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ markdown })
  });

  alert('Page sent to backend as Markdown');
}