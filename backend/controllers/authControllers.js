const { executeQuery } = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Charger les variables d'environnement

// Fonction pour l'inscription
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation de l'email et du mot de passe
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email invalide' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Le mot de passe doit contenir au moins 6 caractères' });
  }

  try {
    // Vérification si l'email est déjà utilisé
    const checkEmail = await executeQuery('SELECT * FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion de l'utilisateur dans la base de données
    const newUser = await executeQuery(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      id: newUser.rows[0].id,
      username: newUser.rows[0].username,
      email: newUser.rows[0].email,
    });
  } catch (err) {
    console.error('Erreur d\'inscription', err);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

// Fonction pour la connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Recherche de l'utilisateur par email
    const userResult = await executeQuery('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Utilisateur non trouvé. Vérifiez votre email.' });
    }

    const user = userResult.rows[0];

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }

    // Création du jeton JWT avec une clé secrète stockée dans les variables d'environnement
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({
      message: 'Connexion réussie',
      token,
    });
  } catch (err) {
    console.error('Erreur de connexion', err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};
