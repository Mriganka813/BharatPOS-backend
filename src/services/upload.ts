import { UploadedFile } from "express-fileupload";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

export const uploadImage = (file: UploadedFile) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.v2.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(file.data).pipe(stream);
  });
};
