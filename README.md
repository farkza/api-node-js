# API Bibliothèque en Node.js

## Description

Cette application est une API RESTful construite en Node.js qui simule le fonctionnement d'une petite bibliothèque. Elle permet aux utilisateurs d'ajouter des livres, d'emprunter des livres et de les retourner. L'API inclut également un mécanisme d'authentification par API Key et gère les modifications concurrentes.

## Prérequis

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/en/) et [npm](https://www.npmjs.com/) sur votre machine.

## Installation

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/votre-utilisateur/votre-repo.git
    cd votre-repo

  Installez les dépendances :

    ```bash
    npm install

## Utilisation

2. Pour lancer l'application, exécutez la commande suivante depuis la racine du projet :

    ```bash
    npm start

3. L'application sera accessible à l'adresse suivante :

    ```bash
    http://localhost:8000/api

⚠️ Pour pouvoir envoyer des requêtes à l'API, vous devrez saisir une api-key en header, veuillez trouver celle-ci dans le fichier /src/middlewares/auth.js