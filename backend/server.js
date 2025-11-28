const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/dzongkha_learning", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
  dzongkha: String,
  english: String,
  pronunciation: String,
  category: String
});

const Flashcard = mongoose.model("Flashcard", flashcardSchema);

// Sample data
const sampleFlashcards = [
  {
    dzongkha: "ཀུང་ཌྲུ",
    english: "Hello",
    pronunciation: "Kuzu zangpo la",
    category: "Greetings"
  },
  {
    dzongkha: "བཀྲ་ཤིས་བདེ་ལེགས།",
    english: "Blessings and good luck",
    pronunciation: "Tashi delek",
    category: "Greetings"
  },
  {
    dzongkha: "ཁ་རྗེ་ག་དེ་རེད།",
    english: "What is your name?",
    pronunciation: "Chhoe gi minga ga chi mo?",
    category: "Questions"
  }
];

// Initialize sample data
app.get("/api/init", async (req, res) => {
  try {
    await Flashcard.deleteMany({});
    await Flashcard.insertMany(sampleFlashcards);
    res.json({ message: "✅ Sample data added!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all flashcards
app.get("/api/flashcards", async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
