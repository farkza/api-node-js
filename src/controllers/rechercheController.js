const { Livre, Auteur, sequelize } = require('../models');
const { Op } = require('sequelize'); // Import de l'opérateur Op depuis Sequelize

const rechercherLivres = async (req, res) => {
  const mots = req.params.mots.split(' ');

  try {
    // Rechercher les livres parmi les titres
    const livresParTitre = await Livre.findAll({
      include: Auteur,
      where: {
        titre: { [Op.like]: `%${mots.join('%')}%` }
      }
    });

    // Rechercher les livres parmi les noms et prénoms des auteurs
    const livresParAuteur = await Livre.findAll({
      include: {
        model: Auteur,
        where: {
          [Op.or]: mots.map(mot => ({
            [Op.or]: [
              { nom: { [Op.like]: `%${mot}%` } },
              { prenom: { [Op.like]: `%${mot}%` } }
            ]
          }))
        }
      }
    });

    // Fusionner les deux listes de livres
    const livres = [...livresParTitre, ...livresParAuteur];

    // Calculer le score pour chaque livre en comptant le nombre de mots correspondants
    const livresAvecScore = livres.map(livre => {
      let score = 0;
      mots.forEach(mot => {
        if (livre.titre.toLowerCase().includes(mot.toLowerCase())) {
          score++;
        }
        livre.Auteurs.forEach(auteur => {
          if (
            auteur.nom.toLowerCase().includes(mot.toLowerCase()) ||
            auteur.prenom.toLowerCase().includes(mot.toLowerCase())
          ) {
            score++;
          }
        });
      });
      return { livre, score };
    });

    // Trier les livres par score décroissant
    livresAvecScore.sort((a, b) => b.score - a.score);

    // Extraire uniquement les livres (sans le score)
    const livresTries = livresAvecScore.map(item => item.livre);

    res.json(livresTries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { rechercherLivres };
