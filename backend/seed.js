// backend/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

// PASTE YOUR CONNECTION STRING HERE (The same one from server.js)
const MONGO_URI = "mongodb+srv://manu:manu7678@cluster0.bwesay8.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected for seeding..."))
  .catch(err => console.log(err));

const subjectSchema = new mongoose.Schema({
  branch: String,
  semester: Number,
  subject: String,
  subjectCode: String,
  link: String
});

const Subject = mongoose.model('Subject', subjectSchema);

const seedData = async () => {
  // Clear existing data (optional)
  // await Subject.deleteMany({}); 
  
  // Add a sample subject
  await Subject.create({
    branch: "CSE",
    semester: 7,
    subject: "Machine Learning (Demo)",
    subjectCode: "18CS74",
    link: "https://google.com"
  });

  console.log("✅ Data Added Successfully!");
  process.exit();
};

seedData();