// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Fonction pour exécuter une requête SQL
const executeQuery = async (query, values) => {
  const client = await pool.connect(); // Connexion à la base de données
  try {
    const result = await client.query(query, values); // Exécution de la requête
    return result; // Retourner le résultat de la requête
  } finally {
    client.release(); // Relâcher la connexion dans le pool
  }
};

// Fonction pour fermer toutes les connexions à la base de données (si nécessaire)
const closePool = async () => {
  await pool.end(); // Ferme toutes les connexions ouvertes
  console.log('Toutes les connexions ont été fermées.');
};

// Exporter le pool et la fonction executeQuery
module.exports = {
  pool,
  executeQuery,
  closePool,
};
