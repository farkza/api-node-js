const { Livre, Auteur, Emprunt, sequelize } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

const genererETag = (donnees) => {
  // Générer un hachage SHA256 à partir des données de la ressource
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify(donnees));
  return hash.digest('hex');
};

const getLivres = async (req, res) => {
  try {
    const livres = await Livre.findAll({ include: Auteur });
    const etag = genererETag(livres);
    res.setHeader('ETag', etag);
    res.json(livres);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLivreById = async (req, res) => {
  const id = req.params.id;
  try {
    const livre = await Livre.findByPk(id, { include: Auteur });
    if (livre) {
      const etag = genererETag(livre);
      res.setHeader('ETag', etag);
      res.json(livre);
    } else {
      res.status(404).json({ error: 'Livre not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createLivre = async (req, res) => {
  const { titre, annee_publication, quantite, auteurs } = req.body;

  const t = await sequelize.transaction();
  try {
    const livre = await Livre.create({ titre, annee_publication, quantite }, { transaction: t });
    if (auteurs && auteurs.length > 0) {
      const auteurInstances = await Auteur.findAll({ where: { id: { [Op.in]: auteurs } } });
      if (auteurInstances.length !== auteurs.length) {
        throw new Error('One or more authors not found');
      }
      await livre.setAuteurs(auteurInstances, { transaction: t });
    }
    await t.commit();
    res.status(201).json(livre);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
};

const updateLivre = async (req, res) => {
  const id = req.params.id;
  const { titre, annee_publication, auteurs } = req.body;

  try {
    const livre = await Livre.findByPk(id);
    if (!livre) {
      throw new Error('Livre not found');
    }

    const t = await sequelize.transaction();
    await livre.update({ titre, annee_publication }, { transaction: t });
    if (auteurs && auteurs.length > 0) {
      const auteurInstances = await Auteur.findAll({ where: { id: { [Op.in]: auteurs } } });
      if (auteurInstances.length !== auteurs.length) {
        throw new Error('One or more authors not found');
      }
      await livre.setAuteurs(auteurInstances, { transaction: t });
    }
    await t.commit();

    // Rechercher à nouveau le livre mis à jour pour générer l'ETag
    const livreMisAJour = await Livre.findByPk(id, { include: Auteur });
    const etag = genererETag(livreMisAJour);
    res.setHeader('ETag', etag);

    res.json(livreMisAJour);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteLivre = async (req, res) => {
  const id = req.params.id;
  try {
    const livre = await Livre.findByPk(id);
    if (!livre) {
      res.status(404).json({ error: 'Livre not found' });
      return;
    }
    await livre.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getQuantiteLivreById = async (req, res) => {
  const id = req.params.id;
  try {
    const livre = await Livre.findByPk(id);
    if (!livre) {
      return res.status(404).json({ error: 'Livre not found' });
    }
    const empruntsEnCours = await Emprunt.count({ where: { id_livre: id, date_retour: null } });
    const quantiteDisponible = livre.quantite - empruntsEnCours;
    res.json({ quantite_totale: livre.quantite, quantite_disponible: quantiteDisponible });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateQuantiteLivreById = async (req, res) => {
  const id = req.params.id;
  const nouvelleQuantite = req.body.nouvelle_quantite;
  try {
    const livre = await Livre.findByPk(id);
    if (!livre) {
      return res.status(404).json({ error: 'Livre not found' });
    }
    const empruntsEnCours = await Emprunt.count({ where: { id_livre: id, date_retour: null } });
    if (nouvelleQuantite < empruntsEnCours) {
      return res.status(400).json({ error: 'La nouvelle quantité est inférieure au nombre d\'emprunts en cours' });
    }
    await livre.update({ quantite: nouvelleQuantite });
    res.json({ message: 'Quantité mise à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLivres, getLivreById, createLivre, updateLivre, deleteLivre, getQuantiteLivreById, updateQuantiteLivreById };
