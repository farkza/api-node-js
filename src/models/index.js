const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Définition des modèles
const Livre = sequelize.define('Livre', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  annee_publication: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false
  }
});

const Auteur = sequelize.define('Auteur', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  annee_naissance: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  annee_mort: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
});

const Personne = sequelize.define('Personne', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
});

const Emprunt = sequelize.define('Emprunt', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_livre: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Livre,
      key: 'id'
    }
  },
  id_personne: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Personne,
      key: 'id'
    }
  },
  date_emprunt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  date_retour: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

const AuteurLivre = sequelize.define('AuteurLivre', {
  id_auteur: {
    type: DataTypes.INTEGER,
    references: {
      model: Auteur,
      key: 'id'
    }
  },
  id_livre: {
    type: DataTypes.INTEGER,
    references: {
      model: Livre,
      key: 'id'
    }
  }
}, {
  timestamps: false,
  tableName: 'auteur_livre'
});

// Associations
Livre.belongsToMany(Auteur, { through: AuteurLivre, foreignKey: 'id_livre' });
Auteur.belongsToMany(Livre, { through: AuteurLivre, foreignKey: 'id_auteur' });

// Exportation des modèles
module.exports = { sequelize, Livre, Auteur, Personne, Emprunt, AuteurLivre };

// Démarrage du serveur (par exemple, Express.js)
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
