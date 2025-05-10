const { executeQuery, closePool } = require('../db');

// Crée un type ENUM pour la catégorie
const createEnumQuery = `CREATE TYPE category_enum AS ENUM ('electronique', 'vetement', 'alimentation', 'mobilier')`;

// Requête pour créer la table des produits avec l'enum pour la catégorie
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category category_enum NOT NULL,  -- Utilise le type ENUM ici
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createTable = async () => {
  try {
    // Créer l'enum (si nécessaire)
    await executeQuery(createEnumQuery);

    // Créer la table des produits
    await executeQuery(createTableQuery);
    console.log('Table "products" créée avec succès');
  } catch (err) {
    console.error('Erreur lors de la création de la table', err);
  } finally {
    closePool();  // Fermer la connexion après l'opération
  }
};

createTable();
