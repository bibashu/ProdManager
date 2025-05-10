const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

module.exports = router;
