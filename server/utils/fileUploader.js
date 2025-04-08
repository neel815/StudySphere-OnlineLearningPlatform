const cloudinary = require("cloudinary").v2;

exports.uploadFileToCloudinary = async (file, folder) => {
  try {
    const options = { folder };
    
    // For PDF and PPT files, we want to allow them to be viewed/downloaded
    if (file.mimetype.includes("pdf") || file.mimetype.includes("presentation")) {
      options.resource_type = "raw";
    }
    
    console.log("Uploading file to Cloudinary:", {
      folder,
      mimetype: file.mimetype,
      size: file.size,
    });

    const result = await cloudinary.uploader.upload(file.tempFilePath, options);
    
    console.log("Cloudinary upload result:", result);
    
    return result;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
}; 