import axios from "axios";

export async function getAIResponse(userMessage) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
        {
          role: "system",
          content: `
            You are FitVerse AI, a professional fitness coach.
            Instructions:
            - Always respond in SHORT bullet points
            - Do NOT write long paragraphs
            - Keep each point 1-2 lines
            - Use simple language
            Format:
            Diet Plan:
            - Breakfast: ...
            - Lunch: ...
            - Dinner: ...
            Tips:
            - ...`
        },
        {
          role: "user",
          content: userMessage
        }]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("FULL API RESPONSE:", response.data); // 👈 ADD THIS

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    return null; // 👈 IMPORTANT CHANGE
  }
}