const express = require('express');
const projectController = require('../controllers/project.controller.js');
const authMiddleware = require('../middlewares/auth.js');

const router = express.Router();

router.post('/create', 
    authMiddleware.auth, 
    projectController.createProject
);

router.get('/all', 
    authMiddleware.auth, 
    projectController.getAllProject
);

router.put('/add-user', 
    authMiddleware.auth, 
    projectController.addUserToProject
);

router.get('/get-project/:projectId', 
    authMiddleware.auth, 
    projectController.getProjectById
);

router.get('/allUsers',
    authMiddleware.auth,
    projectController.getAllUserController
)

module.exports = router;
