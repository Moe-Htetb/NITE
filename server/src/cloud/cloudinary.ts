import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({
  path: ".env",
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadSingleImage = async (image: string, folder: string) => {
  try {
    if (typeof image !== "string") {
      throw new Error("Image must be a string path or URL");
    }

    const response = await cloudinary.uploader.upload(image, {
      folder,
      timeout: 30000,
      resource_type: "auto",
    });

    return {
      url: response.secure_url,
      public_alt: response.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", {
      message: error.message,
      name: error.name,
      http_code: error.http_code,
      http_response: error.http_response?.body,
    });
    throw error;
  }
};
// Method 3: Upload multiple images
export const uploadMultipleImages = async (
  images: string[],
  folder: string
) => {
  const uploadPromises = images.map((image) =>
    uploadSingleImage(image, folder)
  );

  const results = await Promise.all(uploadPromises);
  return results;
};

export const deleteImage = async (public_alt: string) => {
  try {
    const response = await cloudinary.uploader.destroy(public_alt, {
      // timeout: 10000,
    });

    return response?.result === "ok";
  } catch (error: any) {
    console.error("Cloudinary delete error:", error.message);
    throw error;
  }
};
