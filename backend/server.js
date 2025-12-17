const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
// Using your specific connection string
const MONGO_URI = "mongodb+srv://manu:manu7678@cluster0.bwesay8.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ==========================================
// 🔐 PART 1: AUTHENTICATION (Login System)
// ==========================================

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
    res.json({ success: true, username: user.username });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add New Admin Route (Max 5 Limit)
app.post('/api/add-admin', async (req, res) => {
  const { newUsername, newPassword } = req.body;
  try {
    const existing = await User.findOne({ username: newUsername });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const count = await User.countDocuments();
    if (count >= 5) return res.status(403).json({ success: false, message: "Admin limit reached (Max 5)" });

    await User.create({ username: newUsername, password: newPassword });
    res.json({ success: true, message: "New Admin Added!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 📄 PART 2: RESOURCES (Notes/Subjects)
// ==========================================

// Subject Schema
const subjectSchema = new mongoose.Schema({
  branch: String,
  semester: Number,
  subject: String,
  subjectCode: String,
  link: String
});
const Subject = mongoose.model('Subject', subjectSchema);

// GET: Fetch all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new subject/note
app.post('/api/subjects', async (req, res) => {
  try {
    const newSubject = new Subject(req.body);
    await newSubject.save();
    res.json(newSubject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a note by ID
app.delete('/api/subjects/:id', async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Resource Deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 💬 PART 3: FEEDBACK SYSTEM
// ==========================================

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  name: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Feedback = mongoose.model('Feedback', feedbackSchema);

// POST: Save Feedback
app.post('/api/feedback', async (req, res) => {
  try {
    await Feedback.create(req.body);
    res.json({ success: true, message: "Feedback Received!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET: View Feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const messages = await Feedback.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove feedback by ID
app.delete('/api/feedback/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback Deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 📘 PART 4: SYLLABUS SYSTEM
// ==========================================

// Syllabus Schema
const syllabusSchema = new mongoose.Schema({
  branch: String,
  scheme: String, 
  link: String
});
const Syllabus = mongoose.model('Syllabus', syllabusSchema);

// GET: Fetch all syllabus links
app.get('/api/syllabus', async (req, res) => {
  try {
    const data = await Syllabus.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Upload a new syllabus
app.post('/api/syllabus', async (req, res) => {
  try {
    const newSyllabus = new Syllabus(req.body);
    await newSyllabus.save();
    res.json({ success: true, message: "Syllabus Uploaded!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE: Remove syllabus
app.delete('/api/syllabus/:id', async (req, res) => {
  try {
    await Syllabus.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 🚀 SERVER START
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});