const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

// Define routes
router.post('/upload', upload.single('file1'), userController.uploadImage);
// router.post('/', upload.none(), userController.createPortfolio); 
router.post('/', upload.fields([{ name: 'portfolioHero', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), userController.createPortfolio); 
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);
router.get('/category/:experience', userController.getUsersByCategory);

module.exports = router;
