const express = require('express');
const router = express.Router();
const personneController = require('../controllers/personneController');

// Route pour créer un utilisateur
router.post('/personnes', personneController.createPersonne);

// Route pour récupérer un utilisateur par son email
router.get('/personnes/:email', personneController.getPersonneByEmail);

module.exports = router;
