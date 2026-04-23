import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoute from "./chat.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("FitVerse AI Backend Running");
});

const PORT = 5007;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});