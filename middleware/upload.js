const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create a storage object with a given configuration
const gfsStorage = new GridFsStorage({
  url: process.env.URL,
  file: (req, file) => {
    const match = ["image/png", "image/jpeg", "image/jpg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}fbclone-${file.originalname}`;
      return filename;
    }
    return {
      bucketName: "assets",
      filename: `${Date.now()}fbclone-${file.originalname}`,
    };
  },
});

// Set multer storage engine to the newly created object
const upload = multer({ storage: gfsStorage });

// module.exports = multer({ storage: gfsStorage });
module.exports = upload;
