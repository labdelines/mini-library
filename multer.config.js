// Disk storage version

// const multer = require("multer");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const unique = uuidv4() + path.extname(file.originalname);
//     cb(null, unique);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   const allowed = ["image/jpeg", "image/png", "image/webp"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Invalid file type"));
// };

// module.exports = multer({ storage, fileFilter });


// No disk storage version
const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Invalid file type"));
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional
});

