const { Auteur } = require('../models');

const getAuteurs = async (req, res) => {
  try {
    const auteurs = await Auteur.findAll();
    res.json(auteurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAuteurById = async (req, res) => {
  const id = req.params.id;
  try {
    const auteur = await Auteur.findByPk(id);
    if (auteur) {
      res.json(auteur);
    } else {
      res.status(404).json({ error: 'Auteur not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createAuteur = async (req, res) => {
  const { nom, prenom, annee_naissance, annee_mort } = req.body;
  try {
    const auteur = await Auteur.create({ nom, prenom, annee_naissance, annee_mort });
    res.status(201).json(auteur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateAuteur = async (req, res) => {
  const id = req.params.id;
  const { nom, prenom } = req.body;
  try {
    const auteur = await Auteur.findByPk(id);
    if (!auteur) {
      throw new Error('Auteur not found');
    }
    await auteur.update({ nom, prenom });
    res.json(auteur);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteAuteur = async (req, res) => {
  const id = req.params.id;
  try {
    const auteur = await Auteur.findByPk(id);
    if (!auteur) {
      res.status(404).json({ error: 'Auteur not found' });
      return;
    }
    // Vérifier si l'auteur est utilisé par un ou plusieurs livres ici
    // Si oui, retourner une erreur 400
    await auteur.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAuteurs, getAuteurById, createAuteur, updateAuteur, deleteAuteur };
