// --- IMPORTS ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- MONGODB CONNECTION ---
// 👇 I added '/mandeep' after mongodb.net so your data goes to the right folder
const MONGO_URI = "mongodb+srv://manu:manu7678@cluster0.bwesay8.mongodb.net/mandeep?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// --- SCHEMAS (DATABASE MODELS) ---

// 1. Subject (Notes)
const SubjectSchema = new mongoose.Schema({
  branch: String,
  scheme: String,
  semester: Number,
  subject: String,
  subjectCode: String,
  link: String,
});
const Subject = mongoose.model('Subject', SubjectSchema);

// 2. Syllabus
const SyllabusSchema = new mongoose.Schema({
  branch: String,
  scheme: String,
  link: String,
});
const Syllabus = mongoose.model('Syllabus', SyllabusSchema);

// 3. Contribution Requests (Student Uploads)
const ContributionSchema = new mongoose.Schema({
  name: String,
  branch: String,
  scheme: String,
  semester: String,
  subject: String,
  link: String,
  date: { type: Date, default: Date.now }
});
const Contribution = mongoose.model('Contribution', ContributionSchema);

// 4. Feedback
const FeedbackSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', FeedbackSchema);


// --- API ROUTES ---

// Test Route
app.get('/', (req, res) => {
  res.send("MandeepWebs Backend is Running!");
});

// ==========================================
// 1. NOTES (SUBJECTS) ROUTES
// ==========================================
app.get('/api/subjects', async (req, res) => {
  try {
    const data = await Subject.find();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/subjects', async (req, res) => {
  try {
    const newItem = new Subject(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 2. SYLLABUS ROUTES
// ==========================================
app.get('/api/syllabus', async (req, res) => {
  try {
    const data = await Syllabus.find();
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/syllabus', async (req, res) => {
  try {
    const newItem = new Syllabus(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/syllabus/:id', async (req, res) => {
  try {
    await Syllabus.findByIdAndDelete(req.params.id);
    res.json({ message: "Syllabus Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ==========================================
// 3. STUDENT REQUESTS (CONTRIBUTIONS) ROUTES
// ==========================================

// Submit a Request (Public)
app.post('/api/contribute', async (req, res) => {
  try {
    const newItem = new Contribution(req.body);
    await newItem.save();
    res.json({ message: "Contribution saved!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save" });
  }
});

// View Requests (Admin Only)
app.get('/api/contribute', async (req, res) => {
  try {
    const data = await Contribution.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Delete/Approve Request (Admin Only)
app.delete('/api/contribute/:id', async (req, res) => {
  try {
    await Contribution.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ==========================================
// 4. FEEDBACK ROUTES
// ==========================================

// Send Feedback (Public)
app.post('/api/feedback', async (req, res) => {
  try {
    const newItem = new Feedback(req.body);
    await newItem.save();
    res.json({ message: "Feedback Received" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// View Feedback (Admin)
app.get('/api/feedback', async (req, res) => {
  try {
    const data = await Feedback.find().sort({ date: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete Feedback (Admin)
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback Deleted" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});


// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});