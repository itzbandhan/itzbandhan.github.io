const express = require("express");
const router = express.Router();
const Memory = require("../models/Memory");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Homepage with timeline
router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find().sort({ year: -1, month: 1 });
    res.render("index", { memories });
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
      
      // If only one caption is provided, convert to array
      if (!Array.isArray(captions)) {
        captions = [captions];
      }
      
      const files = req.files;
      
      if (!files || files.length === 0) {
        return res.status(400).send("No files were uploaded.");
      }

      const photos = [];

      // Upload each photo to Cloudinary
      for (let i = 0; i < files.length; i++) {
        const result = await cloudinary.uploader.upload(files[i].path, {
          folder: "sandhu-journey",
        });
        
        // Delete the file from local storage after upload
        fs.unlinkSync(files[i].path);
        
        photos.push({
          url: result.secure_url,
          public_id: result.public_id,
          caption: captions[i] || "",
        });
      }

      // Create new memory
      const memory = new Memory({
        title,
        month,
        year,
        photos,
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

module.exports = router;
