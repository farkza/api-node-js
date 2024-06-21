const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');

router.get('/livre', livreController.getLivres);
router.get('/livre/:id', livreController.getLivreById);
router.get('/livre/:id/quantite', livreController.getQuantiteLivreById); // Nouvelle route
router.put('/livre/:id/quantite', livreController.updateQuantiteLivreById); // Nouvelle route
router.post('/livre', livreController.createLivre);
router.put('/livre/:id', livreController.updateLivre);
router.delete('/livre/:id', livreController.deleteLivre);

module.exports = router;
