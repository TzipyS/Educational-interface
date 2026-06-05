const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');
const verifyJWT = require('../middleware/verifyJWT');
const isAdmin = require('../middleware/isAdminMid');

router.get('/', verifyJWT, isAdmin, promptController.getAllPrompts);
router.get('/user', verifyJWT, promptController.getPromptsByUser);
router.get('/:id', verifyJWT, promptController.getPromptById);
router.post('/', verifyJWT, promptController.createPrompt);
router.post('/:id/messages', verifyJWT, promptController.continuePrompt);

router.delete('/:id', verifyJWT, promptController.deletePrompt);

module.exports = router;
