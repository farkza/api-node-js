const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('./middlewares/auth');
const livreRoutes = require('./routes/livreRoutes');
const auteurRoutes = require('./routes/auteurRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const rechercheRoutes = require('./routes/rechercheRoutes');

const app = express();
app.use(bodyParser.json());
app.use(authenticate);

// Routes Livres
app.use('/api', livreRoutes);

// Routes Auteurs
app.use('/api', auteurRoutes);

// Routes Emprunts
app.use('/api', empruntRoutes);

// Routes Recherche
app.use('/api', rechercheRoutes);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
