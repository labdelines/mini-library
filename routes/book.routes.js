const express = require("express");
const router = express.Router();
const upload = require("../multer.config");

const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

const { authRequired, adminOnly } = require("../middleware/auth");

// PUBLIC ROUTES (read-only)
router.get("/", getBooks);
router.get("/:id", getBook);

// PRIVATE ROUTES (admin)
router.post("/", authRequired, adminOnly, upload.single("coverImage"), createBook);

router.put("/:id", authRequired, adminOnly, upload.single("coverImage"), updateBook);

// For HTML form (if still using POST /update/:id)
router.post("/update/:id", authRequired, adminOnly, upload.single("coverImage"), updateBook);

// DELETE via API
router.delete("/:id", authRequired, adminOnly, deleteBook);


module.exports = router;
