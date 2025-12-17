const mongoose = require('mongoose');

// PASTE YOUR CONNECTION STRING HERE
const MONGO_URI = "mongodb+srv://manu:manu7678@cluster0.bwesay8.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI).then(() => console.log("✅ Connected!"));

const User = mongoose.model('User', new mongoose.Schema({ username: String, password: String }));

const create = async () => {
  await User.deleteMany({}); // Clears old users
  await User.create({ username: "mandeep", password: "admin123" });
  console.log("✅ Master Admin Created: mandeep / admin123");
  process.exit();
};

create();