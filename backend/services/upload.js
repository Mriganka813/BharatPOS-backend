const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

module.exports = uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(file.data).pipe(stream);
  });
};
