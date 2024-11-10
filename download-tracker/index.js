const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors()); // Enable CORS for frontend access

// MongoDB URI
const mongoURI =
  "mongodb+srv://purnachandra:purnachandra890@bookstore.ph7hthk.mongodb.net/?retryWrites=true&w=majority&appName=Bookstore";
  
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((req, res) => {
    console.log("database is connected");
  });

// Define a schema and model for the download counter
const downloadSchema = new mongoose.Schema({
  _id: String,
  count: { type: Number, default: 0 },
});
const Download = mongoose.model("Download", downloadSchema);

// Endpoint to get the current download count
app.get("/download-count", async (req, res) => {
  try {
    const download = await Download.findById("downloadCounter");
    res.json({ count: download ? download.count : 0 });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve count" });
  }
});

// Endpoint to increment the download count
app.post("/increment-download", async (req, res) => {
  try {
    console.log("Incrementing download count...");
    const download = await Download.findByIdAndUpdate(
      "downloadCounter",
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    console.log(`Download count updated to: ${download.count}`);
    res.json({ count: download.count });
  } catch (error) {
    console.error("Failed to increment count", error);
    res.status(500).json({ error: "Failed to increment count" });
  }
});


const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
