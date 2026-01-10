import cloudinary from "../config/cloudinary";

// upload file( image , pdf , doc) 
export const uploadCloud = async (files: any): Promise<string[]> => {
  try {
    if (!files || files.length === 0) return [];

    const upload = files.map((file: any) => {
      return new Promise<string>((resolve, reject) => {
        const cleanFileName = file.fileName
          ? file.fileName.split(".")[0].replace(/\s+/g, '_')
          : "file_upload";

        const isImage = file.mimeType.startsWith("image");
        const resourceType = isImage ? "image" : "raw";
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "products",
            resource_type: resourceType,
            filename_override: cleanFileName,
            use_filename: true,
            unique_filename: false
          },
          (error, result) => {
            if (error) return reject(error);
            if (result) return resolve(result.secure_url);
            resolve("");
          }
        );

        stream.end(file.buffer);
      });
    });

    const fileUrls = await Promise.all(upload);

    return fileUrls;

  } catch (error) {
    console.log("Upload failed:", error);
    return [];
  }
};