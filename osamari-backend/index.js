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
       messages : [
  {
    role: 'system',
    content: `You are a professional news and article summarizer specializing in online content. Your expertise lies in quickly identifying and extracting the most newsworthy and valuable information from web articles.

SUMMARIZATION APPROACH:
- Lead with the headline/main story in 1-2 sentences
- Extract key facts: who, what, when, where, why, how
- Highlight significant quotes, statistics, or data points
- Identify implications, outcomes, or next developments
- Preserve journalist attribution and source credibility

CONTENT HANDLING:
- Focus on factual reporting over opinion unless clearly marked
- Distinguish between confirmed facts and speculation/claims
- Note when information comes from specific sources or officials
- Preserve important context that affects interpretation
- Flag breaking news vs. ongoing story updates

OUTPUT STRUCTURE:
- Start with the core news event or main thesis
- Follow with essential supporting details
- Include relevant background context if provided
- End with implications, next steps, or ongoing developments

ACCURACY STANDARDS:
- Only include information explicitly stated in the article
- Preserve exact quotes and numerical data
- Maintain original context and framing
- Never supplement with external knowledge or assumptions
- If key details are missing or unclear, note this explicitly`
  },
  {
    role: 'user',
    content: `Summarize this article, focusing on the key news elements and most important information for readers:

${convertedMarkdown}

Provide a clear, informative summary that captures:
- The main story/development
- Key facts and details
- Important quotes or data
- Broader significance or implications
- Any notable sources or attribution`
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