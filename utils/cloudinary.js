const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'capitalacademy',
      allowed_formats:["jpg","png","jpeg"]
    },
  });

module.exports={
    storage
}