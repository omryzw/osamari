document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('sendBtn');
  const loading = document.getElementById('loading');
  const summaryDiv = document.getElementById('summary');

  sendBtn.addEventListener('click', async () => {
    summaryDiv.style.display = 'none';
    loading.style.display = 'block';
    sendBtn.disabled = true;

    // Get the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      // Inject Turndown if needed, then extract content and send to backend
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["turndown.js"]
      }, () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            const title = document.title;
            const bodyHTML = document.body.innerHTML;
            const turndownService = new window.TurndownService();
            const markdown = turndownService.turndown(`<h1>${title}</h1>${bodyHTML}`);
            // Format markdown: convert **bold** to <strong>bold</strong> and preserve spacing
            let formatted = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Replace double newlines with <br><br> for spacing
            formatted = formatted.replace(/\n\n/g, '<br><br>');
            return formatted;
          }
        }, async (results) => {
          const markdown = results[0].result;
          // Send to backend
          try {
            const response = await fetch('http://localhost:3000/api/convert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ markdown })
            });
            const data = await response.json();
            loading.style.display = 'none';
            summaryDiv.style.display = 'block';
            // Render summary as HTML, supporting <strong> and spacing
            summaryDiv.innerHTML = data.summary || 'No summary returned.';
          } catch (e) {
            loading.style.display = 'none';
            summaryDiv.style.display = 'block';
            summaryDiv.textContent = 'Error: ' + e.message;
          } finally {
            sendBtn.disabled = false;
          }
        });
      });
    });
  });
});