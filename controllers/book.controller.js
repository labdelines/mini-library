const Book = require("../models/book.model");
const imagekit = require("../utils/imageKit");
const fs = require("fs");

// CREATE BOOK
exports.createBook = async (req, res) => {
  try {
    const { title, category, amount, zone, description } = req.body;

    let imageUrl = null;
    let imageKitId = null;

    // Upload to ImageKit if image is provided
    if (req.file) {
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(req.file.path), // file buffer
        fileName: req.file.filename, // original filename
        folder: "/books", // folder inside ImageKit
      });

      imageUrl = uploaded.url;
      imageKitId = uploaded.fileId;
    }

    await Book.create({
      title,
      category,
      amount,
      zone,
      description,
      coverImage: imageUrl,
      imageKitId: imageKitId,
    });

    return res.json({ success: true, message: "Book created successfully" });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET ALL BOOKS
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error("GET ALL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ONE BOOK
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });

    res.json(book);
  } catch (err) {
    console.error("GET ONE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE BOOK + OPTIONAL IMAGE REPLACEMENT
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });

    const { title, category, amount, zone, description } = req.body;

    let newImageUrl = book.coverImage;
    let newImageKitId = book.imageKitId;

    // If user uploaded a new image → replace the old one
    if (req.file) {
      // Upload new image
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(req.file.path),
        fileName: req.file.filename,
        folder: "/books",
      });

      newImageUrl = uploaded.url;
      newImageKitId = uploaded.fileId;

      // Delete old image if existed
      if (book.imageKitId) {
        await imagekit.deleteFile(book.imageKitId);
      }
    }

    // Update fields
    book.title = title;
    book.category = category;
    book.amount = amount;
    book.zone = zone;
    book.description = description;
    book.coverImage = newImageUrl;
    book.imageKitId = newImageKitId;

    await book.save();

    return res.json({ success: true, message: "Book updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// DELETE BOOK + DELETE IMAGE FROM IMAGEKIT
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Not found" });

    if (book.imageKitId) {
      await imagekit.deleteFile(book.imageKitId);
    }

    await book.deleteOne();
    return res.json({ success: true, message: "Book deleted successfully" }); // ✅ FIX
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
