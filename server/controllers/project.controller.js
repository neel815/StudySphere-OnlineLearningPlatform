const projectModel = require("../models/project.model.js");
const projectService = require("../utils/project.service.js");
const userModel = require("../models/User.js");

const createProject = async (req, res) => {
    try {
        const { name } = req.body;
        console.log(name);
        if (!name) return res.status(400).json({ error: "Project name is required" });

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) return res.status(404).json({ error: "User not found" });

        const userId = loggedInUser._id;
        const newProject = await projectService.createProject({ name, userId });

        res.status(200).json(newProject);
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const getAllProject = async (req, res) => {
    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) return res.status(404).json({ error: "User not found" });

        const allUserProjects = await projectService.getAllProjectByUserId(loggedInUser._id);

        return res.status(200).json({ projects: allUserProjects });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const addUserToProject = async (req, res) => {
    try {
        const { projectId, users } = req.body;
        if (!projectId) return res.status(400).json({ error: "Project ID is required" });
        if (!users || !Array.isArray(users)) return res.status(400).json({ error: "Users array is required" });

        const loggedInUser = await userModel.findOne({ email: req.user.email });
        if (!loggedInUser) return res.status(404).json({ error: "User not found" });

        const project = await projectService.addUsersToProject({
            users,
            projectId,
            userId: loggedInUser._id,
        });

        return res.status(200).json({ project });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getProjectById = async (req, res) => {
    const { projectId } = req.params;
    
    try {
        if (!projectId) return res.status(400).json({ error: "Project ID is required" });
        
        const project = await projectService.getProjectById({ projectId });
        
        if (!project) return res.status(404).json({ error: "Project not found" });

        return res.status(200).json({ project });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
};

const getAllUserController=async(req,res)=>{
    try{
        const loggedInUser=await userModel.findOne({
            email:req.user.email, 
        })
        
        const allUsers=await userModel.find({
            _id:{
                $ne:loggedInUser._id,
            }
        });

        return res.status(200).json({users:allUsers});

    }catch(err){
        console.log(err);
        return res.status(400).json({
            error:err,
        })
    }
}

module.exports = {
    createProject,
    getAllProject,
    addUserToProject,
    getProjectById,
    getAllUserController,
};
