const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// --- 1. NOTES SCHEMA ---
const subjectSchema = new mongoose.Schema({
    subject: String,
    subjectCode: String,
    branch: String,
    semester: String,
    scheme: String, 
    link: String,
    module: String,
    createdAt: { type: Date, default: Date.now }
});
const Subject = mongoose.model('Subject', subjectSchema);

// --- 2. FEEDBACK SCHEMA (NEW) ---
const feedbackSchema = new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// --- API ROUTES ---

// GET Notes
app.get('/api/subjects', async (req, res) => {
    const subjects = await Subject.find();
    res.json(subjects);
});

// POST Note
app.post('/api/subjects', async (req, res) => {
    const newSubject = new Subject(req.body);
    await newSubject.save();
    res.json(newSubject);
});

// DELETE Note
app.delete('/api/subjects/:id', async (req, res) => {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 👇👇👇 FEEDBACK ROUTES (NEW) 👇👇👇

// POST Feedback (Students send this)
app.post('/api/feedback', async (req, res) => {
    try {
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();
        res.json({ message: "Feedback saved!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET Feedback (For Admin Panel)
app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ date: -1 }); // Newest first
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE Feedback
app.delete('/api/feedback/:id', async (req, res) => {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));