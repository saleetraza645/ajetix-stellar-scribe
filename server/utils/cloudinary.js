import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
  } else {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud_name || !api_key || !api_secret) {
      throw new Error(
        "Cloudinary not configured (set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET)",
      );
    }
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  }
  configured = true;
}

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} buffer
 * @param {string} [folder="ajetix/projects"]
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export async function uploadImage(buffer, folder = "ajetix/projects") {
  ensureConfigured();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );
    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by public_id.
 * @param {string} publicId
 */
export async function deleteImage(publicId) {
  ensureConfigured();
  return cloudinary.uploader.destroy(publicId);
}
