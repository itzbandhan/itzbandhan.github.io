const express = require("express");
const router = express.Router();
const Memory = require("../models/Memory");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// Month ordering helper
const monthOrder = {
  January: 1, February: 2, March: 3, April: 4,
  May: 5, June: 6, July: 7, August: 8,
  September: 9, October: 10, November: 11, December: 12
};

const months = Object.keys(monthOrder);

// Homepage with timeline
router.get("/", async (req, res) => {
  try {
    let memories = await Memory.find();

    // Sort by year, then by month order
    memories.sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year; // ascending by year
      }
      return monthOrder[a.month] - monthOrder[b.month];
    });

    // Collect distinct years for dropdown
    const years = [...new Set(memories.map(m => m.year))].sort();

    res.render("index", { memories, years, months });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error: " + err.message);
  }
});

// Upload form
router.get("/upload", (req, res) => {
  res.render("upload");
});

// Handle upload - use multer middleware from app.locals inside the route
router.post("/upload", function(req, res, next) {
  req.app.locals.upload.array("photos", 10)(req, res, async function(err) {
    if (err) {
      console.error(err);
      return res.status(500).send("File upload error: " + err.message);
    }
    
    try {
      const { title, month, year } = req.body;
      let captions = req.body.captions;
      
      if (!Array.isArray(captions)) {
        captions = [captions];
      }
      
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      const photos = [];

      for (let i = 0; i < files.length; i++) {
        const result = await cloudinary.uploader.upload(files[i].path, {
          folder: "sandhu-journey",
        });
        
        fs.unlinkSync(files[i].path);
        
        photos.push({
          url: result.secure_url,
          public_id: result.public_id,
          caption: captions[i] || "",
        });
      }

      const memory = new Memory({
        title,
        month,
        year,
        photos,
        createdAt: new Date() // ensure createdAt exists
      });

      await memory.save();
      res.redirect("/");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error: " + err.message);
    }
  });
});

// Get memory details by ID
router.get("/memory/:id", async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).send("Memory not found");
    }
    res.render("memory-detail", { memory });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error: " + err.message);
  }
});

// Get timeline by year + month (for search)
router.get("/timeline/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const memory = await Memory.findOne({ year, month });
    if (!memory) {
      return res.status(404).send("Album not found");
    }
    res.render("memory-detail", { memory });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error: " + err.message);
  }
});

module.exports = router;
