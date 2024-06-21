const { Emprunt, Livre, Personne, sequelize } = require('../models');

const createEmprunt = async (req, res) => {
  const { id_livre, nom, prenom, email } = req.body;

  // Vérification de la présence des informations nécessaires
  if (!id_livre || !nom || !prenom || !email) {
    return res.status(400).json({ error: 'Veuillez fournir toutes les informations nécessaires' });
  }

  const t = await sequelize.transaction();
  try {
    // Rechercher la personne emprunteur dans la table Personnes
    let personne = await Personne.findOne({ where: { email } });
    if (!personne) {
      // Créer la personne si elle n'existe pas
      personne = await Personne.create({ nom, prenom, email }, { transaction: t });
    } else {
      // Vérifier si les informations correspondent à celles de la personne trouvée
      if (personne.nom !== nom || personne.prenom !== prenom) {
        throw new Error('Les informations ne correspondent pas à l\'email fourni');
      }
    }

    // Rechercher le livre dans la table Livres
    const livre = await Livre.findByPk(id_livre);

    // Vérifier si le livre est trouvé et si sa quantité disponible est supérieure à zéro
    const empruntsEnCours = await Emprunt.count({ where: { id_livre: id_livre, date_retour: null } });
    const quantiteDisponible = livre.quantite - empruntsEnCours;
    if (!livre || quantiteDisponible <= 0) {
      throw new Error('Le livre n\'est pas disponible');
    }

    // Créer l'emprunt
    const emprunt = await Emprunt.create({
      id_livre,
      id_personne: personne.id,
      date_emprunt: new Date(),
      createdAt: new Date()
    }, { transaction: t });

    // Ne pas décrémenter la quantité de livres disponibles

    await t.commit();
    res.status(201).json(emprunt);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

const updateEmprunt = async (req, res) => {
  const id = req.params.id;
  try {
    const emprunt = await Emprunt.findByPk(id);
    if (!emprunt) {
      throw new Error('Emprunt non trouvé');
    }
    
    // Vérifier si l'emprunt est déjà retourné
    if (emprunt.date_retour !== null) {
      throw new Error('Cet emprunt est déjà retourné');
    }

    // Modifier la date de retour de l'emprunt
    emprunt.date_retour = new Date();
    emprunt.updatedAt = new Date();
    await emprunt.save();

    res.json(emprunt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { createEmprunt, updateEmprunt };
