const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');

router.post('/emprunt', empruntController.createEmprunt);
router.put('/emprunt/:id', empruntController.updateEmprunt);

module.exports = router;
