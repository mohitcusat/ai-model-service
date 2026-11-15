const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health-check GET route for Uptime Robot monitoring
app.get("/", (req, res) => {
  res.status(200).send("AI Microservice is Live and Healthy!");
});

// POST route to process AI prompts
app.post("/api/ai/process", (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The 'prompt' field is required.",
    });
  }

  const processedResponse = {
    status: "success",
    userId: userId || null,
    prompt,
    processedPrompt: `[Processed] ${prompt}`,
    mockAiResponse: "This is a mock AI-generated response for demonstration purposes.",
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(processedResponse);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;