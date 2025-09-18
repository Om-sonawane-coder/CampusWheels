const multer = require('multer');
const path = require('path');

// Hum memoryStorage use kar rahe hain, iska matlab hai ki file server par save hone ke bajaye, 
// memory me ek buffer ke roop me rahegi. Wahan se hum use direct Cloudinary par bhej denge.
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    // Sirf image files allow karo
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: File upload only supports the following filetypes - ' + filetypes));
  }
});

module.exports = upload;