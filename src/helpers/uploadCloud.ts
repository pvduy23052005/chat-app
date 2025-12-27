import cloudinary from "../config/cloudinary";

export const uploadCloud = async (images: string[]): Promise<string[]> => {
  try {
    let imageUrls: string[] = [];

    if (images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "products",
          allowed_formats: ["jpg", "png", "jpeg"],
          transformation: [{ width: 200, height: 200, crop: "limit" }],
        });
        imageUrls.push(result.secure_url);
      }
    }
    return imageUrls;

  } catch (error) {
    console.log("Upload failed:", error);
    return [];
  }
};