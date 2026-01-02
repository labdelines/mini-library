const Book = require("../models/book.model");
const imagekit = require("../utils/imageKit");

// CREATE BOOK
exports.createBook = async (req, res) => {
  try {
    const { title, category, amount, zone, description } = req.body;

    let imageUrl = null;
    let imageKitId = null;

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "/books",
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
      imageKitId,
    });

    res.json({ success: true, message: "Book created successfully" });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
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

    let newImageUrl = book.coverImage;
    let newImageKitId = book.imageKitId;

    if (req.file) {
      const uploaded = await imagekit.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "/books",
      });

      newImageUrl = uploaded.url;
      newImageKitId = uploaded.fileId;

      if (book.imageKitId) {
        await imagekit.deleteFile(book.imageKitId);
      }
    }

    Object.assign(book, req.body, {
      coverImage: newImageUrl,
      imageKitId: newImageKitId,
    });

    await book.save();

    res.json({ success: true, message: "Book updated successfully" });
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
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
