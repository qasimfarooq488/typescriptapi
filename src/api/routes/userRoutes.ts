// In your routes file
const express = require("express");
const userController = require('../controllers/usercontroller');

const router = express.Router();

router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.patch('/:id',userController.updateUser);
router.delete('/:id', userController.deleteUser);  // Add the DELETE route here


export default router
