const router = require('express').Router();
const wrapAsync = require("../../utils/wrapAsync");
const multer = require("multer");
const { storage } = require('../../utils/cloudinary');



const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        try {
            if (file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(new Error('Select a valid image!'));
            }
        } catch (error) {
            console.log(error)
        }
    }
});

router.post('/img', upload.single('image'), wrapAsync(async (req, res) => {
    try {
        const fileURL = req.file.path;
        res.json({ message: "File uploaded", fileURL });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: "Image not uploaded" });
    }
}));



router.get('/', (req, res) => {
    res.send('upload route');
});

module.exports = router;
