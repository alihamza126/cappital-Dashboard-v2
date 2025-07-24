const multer = require("multer");

const screenshotStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/payment/'); // Set the destination folder
    },
    filename: function (req, file, cb) {
        // Generate a unique filename using the current timestamp and original filename
        const uniqueFilename = Date.now() + '-' + file.originalname;
        cb(null, uniqueFilename);
    }
});

module.exports = screenshotStorage;