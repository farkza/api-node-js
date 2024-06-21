const express = require('express');
const router = express.Router();
const rechercheController = require('../controllers/rechercheController');

router.get('/recherche/:mots', rechercheController.rechercherLivres);

module.exports = router;
