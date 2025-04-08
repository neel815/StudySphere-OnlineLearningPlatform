const Section = require("../models/Section");
const { uploadFileToCloudinary } = require("../utils/fileUploader");

exports.addCourseMaterial = async (req, res) => {
  try {
    const { sectionId, materialTitle } = req.body;
    const materialFile = req.files?.materialFile;

    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    if (!sectionId || !materialTitle || !materialFile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Upload file to Cloudinary
    const uploadResponse = await uploadFileToCloudinary(
      materialFile,
      process.env.FOLDER_NAME
    );

    if (!uploadResponse) {
      return res.status(400).json({
        success: false,
        message: "File upload failed",
      });
    }

    // Update section with material info
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          materials: {
            title: materialTitle,
            fileUrl: uploadResponse.secure_url,
            fileType: materialFile.mimetype,
          },
        },
      },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Material added successfully",
      data: updatedSection.materials[updatedSection.materials.length - 1],
    });
  } catch (error) {
    console.error("Error in addCourseMaterial:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add material",
      error: error.message,
    });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { materialId, sectionId } = req.body;

    if (!materialId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          materials: {
            _id: materialId,
          },
        },
      },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Material deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error in deleteMaterial:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete material",
      error: error.message,
    });
  }
}; 