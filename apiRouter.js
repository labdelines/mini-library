// apiRouter.js
const express = require("express");
const router = express.Router();

router.use("/auth", require("./routes/auth.routes"));
router.use("/books", require("./routes/book.routes"));

module.exports = router;
