const express = require('express');
const router = express.Router();
const auteurController = require('../controllers/auteurController');

router.get('/auteur', auteurController.getAuteurs);
router.get('/auteur/:id', auteurController.getAuteurById);
router.post('/auteur', auteurController.createAuteur);
router.put('/auteur/:id', auteurController.updateAuteur);
router.delete('/auteur/:id', auteurController.deleteAuteur);

module.exports = router;
