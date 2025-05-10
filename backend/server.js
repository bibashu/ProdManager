// src/index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const db = require('./db'); // Import de la connexion

// Autoriser toutes les origines (à restreindre en prod)
app.use(cors());
const userRoutes = require('./routes/userRoute'); // Import des routes utilisateur
const productRoutes = require('./routes/productRoute'); // Import des routes produit
// Utilisation des routes
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', userRoutes);
app.use('/api/products', productRoutes); // Utilisation des routes produit
// swagger 
// swaggerDocs(app)

app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ heure_serveur: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ message: "Erreur base de données", error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
