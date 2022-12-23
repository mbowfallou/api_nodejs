const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Créez une instance de l'application Express
const app = express();

// Configurez le middleware body-parser pour analyser les demandes entrantes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Définissez les variables de connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'node_db'
});

// Connectez-vous à la base de données
connection.connect();

// Démarrez le serveur en écoutant les requêtes entrantes sur le port 3000
app.listen(3000, () => {
    console.log('API REST en écoute sur le port 3000');
});

app.get('/', async (req, res) => {
    res.json({status: "User API est pret à partir !!!"});
});

app.get('/users', (req, res) => {
    // Exécutez la requête MySQL pour récupérer tous les utilisateurs
    connection.query('SELECT * FROM users', (error, results) => {
      if (error) {
        // Si une erreur est survenue, envoyer un statut d'erreur 500 et un message d'erreur
        res.status(500).send(error);
      } else {
        // Si tout s'est bien passé, envoyer les résultats de la requête
        res.send(results);
      }
    });
});

app.get('/users/:id', (req, res) => {
// Récupérez l'ID de l'utilisateur à partir des paramètres de la route
const id = req.params.id;

// Exécutez la requête MySQL pour récupérer l'utilisateur avec l'ID spécifié
connection.query('SELECT * FROM users WHERE id = ?', [id], (error, results) => {
    if (error) {
    // Si une erreur est survenue, envoyer un statut d'erreur 500 et un message d'erreur
    res.status(500).send(error);
    } else {
    // Si tout s'est bien passé, envoyer les résultats de la requête
    res.send(results);
    }
});
});

app.post('/users', (req, res) => {
// Récupérez les données de l'utilisateur à partir du corps de la demande
const fname = req.body.fname;
const lname = req.body.lname;

// Exécutez la requête MySQL pour insérer un nouvel utilisateur
connection.query(
    'INSERT INTO users (fname, lname) VALUES (?, ?)',
    [fname, lname],
    (error, results) => {
    if (error) {
        // Si une erreur est survenue, envoyer un statut d'erreur 500 et un message d'erreur
        res.status(500).send(error);
    } else {
        // Si tout s'est bien passé, envoyez un statut de réussite et l'ID du nouvel utilisateur créé
        res.send({ status: 'success', id: results.insertId });
    }
    }
);
});

app.put('/users/:id', (req, res) => {
// Récupérez l'ID de l'utilisateur à partir des paramètres de la route
const id = req.params.id;

// Récupérez les nouvelles données de l'utilisateur à partir du corps de la demande
const fname = req.body.fname;
const lname = req.body.lname;

// Exécutez la requête MySQL pour mettre à jour l'utilisateur avec l'ID spécifié
connection.query(
    'UPDATE users SET fname = ?, lname = ? WHERE id = ?',
    [fname, lname, id],
    (error, results) => {
    if (error) {
        // Si une erreur est survenue, envoyer un statut d'erreur 500 et un message d'erreur
        res.status(500).send(error);
    } else {
        // Si tout s'est bien passé, envoyez un statut de réussite
        res.send({ status: 'success' });
    }
    }
);
});

  // Créez une route pour supprimer un utilisateur existant
app.delete('/users/:id', (req, res) => {
    // Récupérez l'ID de l'utilisateur à partir des paramètres de la route
    const id = req.params.id;
  
    // Exécutez la requête MySQL pour supprimer l'utilisateur de la base de données
    connection.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
      if (error) {
        // Si une erreur est survenue, envoyer un statut d'erreur 500 et un message d'erreur
        res.status(500).send(error);
      } else {
        // Si tout s'est bien passé, envoyer les résultats de la requête
        //res.send(results);
        res.send({ status: 'successful removal', results });
      }
    });
  });
  