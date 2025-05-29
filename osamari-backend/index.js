const express = require('express');
const cors = require('cors');
const TurndownService = require('turndown');
const { Ollama } = require('ollama');
const client = new Ollama({ host: 'http://localhost:11434' });
const model = "gemma3:27b";
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const turndownService = new TurndownService();

// POST /api/convert - Accepts either HTML or Markdown
app.post('/api/convert', async (req, res) => {
  try {
    const { html, markdown } = req.body;

    if (!html && !markdown) {
      return res.status(400).json({ error: 'Missing html or markdown in body.' });
    }

    let convertedMarkdown = markdown;

    if (html) {
      convertedMarkdown = turndownService.turndown(html);
    }

    // Example: log it or save to a database, file, etc.
    console.log('Received Markdown:\n', convertedMarkdown);

    // use ollama to summarize the markdown content
    const response = await client.chat({
      model,
       messages :[
  {
    role: 'system',
    content: `You are a news summarizer. Extract key information from articles in this order:

1. Lead with the main story in 1-2 sentences
2. Include essential facts: who, what, when, where, why
3. Add important quotes, data, or sources
4. Note implications or next developments

Rules:
- Only use information from the source material
- Preserve exact quotes and numbers
- Flag unclear or missing details
- Keep summaries concise but complete`
  },
  {
    role: 'user',
    content: `Summarize this article focusing on the main story, key facts, and important details:

${convertedMarkdown}`
  }
]
    });

    const summary = response.message.content;
    console.log('Summary:', summary);
    return res.json({
      status: 'success',
      summary: summary,
    });



  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
});

app.listen(port, () => {
  console.log(`Markdown API running at http://localhost:${port}`);
});