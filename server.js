const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// 1. MONGODB CONNECTION & SCHEMA
// ==========================================
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected successfully to AI Microservice"))
    .catch((err) => console.error("MongoDB connection error:", err));
} else {
  console.warn("Warning: MONGO_URI is not defined in environment variables.");
}

// Define a schema to store AI interaction logs and data-driven history
const aiLogSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  prompt: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const AiLog = mongoose.model("AiLog", aiLogSchema);

// ==========================================
// 2. HEALTH-CHECK GET ROUTE (For Uptime Robot)
// ==========================================
app.get("/", (req, res) => {
  res.status(200).send("AI Microservice is Live and Healthy!");
});

// ==========================================
// 3. POST ROUTE TO PROCESS AI PROMPTS
// ==========================================
app.post("/api/ai/process", async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Bad Request",
        message: "The 'prompt' field is required.",
      });
    }

    const mockAiResponse = "This is a data-driven AI response connected to MongoDB.";

    // Save interaction history in MongoDB
    if (mongoose.connection.readyState === 1) {
      try {
        await AiLog.create({
          userId: userId || "anonymous",
          prompt,
          response: mockAiResponse
        });
      } catch (dbError) {
        console.error("Failed to save log to MongoDB:", dbError);
      }
    }

    const processedResponse = {
      status: "success",
      userId: userId || null,
      prompt,
      processedPrompt: `[Processed] ${prompt}`,
      mockAiResponse,
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(processedResponse);

  } catch (error) {
    console.error("AI Processing Error:", error);
    return res.status(500).json({ error: "Internal Server Error in AI Microservice" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;