const { executeQuery } = require('../db');
const path = require('path');
const fs = require('fs');

// Fonction pour créer un produit
exports.createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Requête pour insérer le produit dans la base de données
    const result = await executeQuery(
      'INSERT INTO products (name, description, price, category, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, price, category, image_url, created_at',
      [name, description, price, category, imageUrl]
    );

    res.status(201).json({
      message: 'Produit créé avec succès',
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Erreur lors de la création du produit', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour récupérer tous les produits
exports.getAllProducts = async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour récupérer un produit par son ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await executeQuery('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur lors de la récupération du produit', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Fonction pour mettre à jour un produit
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category } = req.body;
    const newImage = req.file ? `/uploads/${req.file.filename}` : null;
  
    try {
      const validCategories = ['electronique', 'vetement', 'alimentation', 'mobilier'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Catégorie invalide' });
      }
  
      // Récupérer le produit actuel
      const productResult = await executeQuery('SELECT * FROM products WHERE id = $1', [id]);
      if (productResult.rows.length === 0) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
  
      const oldProduct = productResult.rows[0];
  
      // Supprimer l’ancienne image du serveur si une nouvelle est fournie
      if (newImage && oldProduct.image_url) {
        const oldImagePath = path.join(__dirname, '..', 'public', oldProduct.image_url);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
  
      // Mettre à jour le produit avec les nouvelles valeurs (ou garder les anciennes)
      const updatedProduct = await executeQuery(
        `UPDATE products 
         SET name = $1, description = $2, price = $3, category = $4, image_url = $5 
         WHERE id = $6 
         RETURNING *`,
        [
          name || oldProduct.name,
          description || oldProduct.description,
          price || oldProduct.price,
          category || oldProduct.category,
          newImage || oldProduct.image_url,
          id
        ]
      );
  
      res.status(200).json(updatedProduct.rows[0]);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du produit', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  

// Fonction pour supprimer un produit
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const productResult = await executeQuery('SELECT * FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Supprimer le produit de la base de données
    await executeQuery('DELETE FROM products WHERE id = $1', [id]);
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du produit', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
