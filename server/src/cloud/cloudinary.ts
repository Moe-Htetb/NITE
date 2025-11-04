import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadSingeImage = async (image: string, folder: string) => {
  if (typeof image !== "string") {
    throw new Error("Image must be a string path or URL");
  }

  const resopnse = await cloudinary.uploader.upload(image, {
    folder,
  });
  return { url: resopnse.secure_url, public_alt: resopnse.public_id };
};

export const deleteImage = async (public_alt: string) => {
  const response = await cloudinary.uploader.destroy(public_alt);
  return response?.result === "ok";
};
