// backend/controllers/sessionController.js
const Session = require('../models/Session');
// Optional: if using OpenAI for summarization:
const { Groq } = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Create a new session: summarization
exports.createSession = async (req, res) => {
  const { userId, meetTranscript } = req.body;
  try {
    // Use Groq's API to summarize the transcript
    const prompt = `Summarize the following Google Meet discussion:\n\n${meetTranscript}\n\nSummary:`;
    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });
    const summary = response.choices[0].message.content.trim();
    
    // Save the session with summary
    const session = new Session({ userId, meetTranscript, summary });
    await session.save();
    res.json({ message: 'Session saved', session });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Retrieve sessions for a user
exports.getSessions = async (req, res) => {
  const { userId } = req.params;
  try {
    const sessions = await Session.find({ userId });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
