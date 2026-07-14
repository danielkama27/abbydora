import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "products"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `abbydora/${folder}` },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(url: string): Promise<void> {
  // Cloudinary public_id is the path segment after /upload/v<version>/ and before the extension
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
  if (!match) return;
  const publicId = match[1];
  await cloudinary.uploader.destroy(publicId);
}
