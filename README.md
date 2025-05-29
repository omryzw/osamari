# Osamari: AI Web Page Summarizer Chrome Extension

Osamari is a Chrome extension that lets you instantly summarize the content of any web page using AI. With a single click, the extension extracts the page content, converts it to Markdown, and sends it to a local backend powered by Ollama for AI summarization. The summary is then beautifully displayed in the extension popup.

---

## Features

- 📝 Extracts the main content and title from any web page
- 🔄 Converts HTML to Markdown for clean, readable input
- 🤖 Summarizes content using a local AI model (Ollama by default)
- 💡 Displays the summary in a modern, responsive popup
- ⚡ Fast, private, and works entirely on your machine

---

## How It Works

1. **Click the Osamari extension icon** on any web page.
2. The extension extracts the page's title and body content.
3. Content is converted to Markdown using Turndown.js.
4. Markdown is sent to a local backend API (`/api/convert`).
5. The backend uses Ollama (or your preferred AI model) to generate a summary.
6. The summary is shown in the extension popup, with formatting preserved.

---

## Setup Instructions

### 1. Clone the Repository

```
git clone <your-repo-url>
cd osamari
```

### 2. Backend Setup (Ollama)

- Make sure you have [Ollama](https://ollama.com/) installed and running locally.
- Pull your desired model (e.g., `gemma3:27b`, `llama2`, `mistral`, etc.):
  ```sh
  ollama pull gemma3:27b
  ollama serve
  ```
- Start the backend server:
  ```sh
  cd osamari-backend
  npm install
  node index.js
  ```

### 3. Frontend (Chrome Extension) Setup

- Go to `chrome://extensions/` in Chrome.
- Enable **Developer mode**.
- Click **Load unpacked** and select the `osamari-frontend` folder.
- You should now see the Osamari extension icon in your browser.

---

## Usage

1. Navigate to any web page you want to summarize.
2. Click the Osamari extension icon.
3. In the popup, click **Summarize Page**.
4. Wait a few seconds for the AI to process the content.
5. The summary will appear in the popup, with bold and spacing preserved.

---

## Customization

- **Switching AI Models:**
  - By default, the backend uses Ollama with the `gemma3:27b` model. You can change the model in `osamari-backend/index.js` by editing the `model` variable.
  - You can also adapt the backend to use a different AI service or API by modifying the summarization logic.

- **Styling:**
  - The popup is fully responsive and can be customized via `popup.html` and `popup.js`.

---

## Troubleshooting

- **No summary appears:**
  - Make sure the backend server is running and Ollama is serving the model.
  - Check the browser console and backend terminal for errors.
- **Model errors:**
  - Ensure the model name in the backend matches a model you have pulled with Ollama.
- **Network issues:**
  - The extension and backend communicate via `http://localhost:3000`. Make sure nothing is blocking this port.

---

## License

MIT License. Feel free to use, modify, and share!

---

## Credits

- [Ollama](https://ollama.com/) for local AI inference
- [Turndown.js](https://github.com/mixmark-io/turndown) for HTML to Markdown conversion

---

Enjoy fast, private, and beautiful AI-powered web page summaries with Osamari!
