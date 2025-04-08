const projectModel = require("../models/project.model.js");
const mongoose = require("mongoose");

const createProject = async ({ name, userId }) => {
    if (!name) throw new Error("name is required");
    if (!userId) throw new Error("userId is required");

    const Project = await projectModel.create({
        name,
        users: [userId],
    });

    return Project;
};

const getAllProjectByUserId = async (userId) => {
    if (!userId) throw new Error("userId is required");

    const allUserProjects = await projectModel.find({
        users: userId,
    });

    return allUserProjects;
};

const addUsersToProject = async ({ users, projectId, userId }) => {
    if (!projectId) throw new Error("projectId is required");
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid projectId");

    if (!users || !Array.isArray(users) || users.some(id => !mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Invalid userId(s) in users array");
    }

    if (!userId) throw new Error("userId is required");
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Invalid userId");

    const project = await projectModel.findOne({
        _id: projectId,
        users: userId,
    });

    if (!project) throw new Error("User does not belong to this project");

    return await projectModel.findOneAndUpdate(
        { _id: projectId },
        { $addToSet: { users: { $each: users } } },
        { new: true }
    );
};

const getProjectById = async ({ projectId }) => {
    if (!projectId) throw new Error("projectId is required");
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error("Invalid projectId");

    return await projectModel.findOne({ _id: projectId }).populate("users");
};

module.exports = {
    createProject,
    getAllProjectByUserId,
    addUsersToProject,
    getProjectById,
};
