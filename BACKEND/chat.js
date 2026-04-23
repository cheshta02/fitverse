import express from "express";
import { getAIResponse } from "./ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User message:", message); // debug

    const aiReply = await getAIResponse(message);

    console.log("AI reply:", aiReply); // debug

    // ❌ REMOVE fallback like "Hello user..."
    if (!aiReply) {
      return res.json({
        reply: "AI failed. Check backend logs."
      });
    }

    res.json({
      reply: aiReply
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

export default router;