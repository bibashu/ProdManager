const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');  // Importer le middleware multer
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productControllers');

// Route pour créer un produit (avec upload d'image)
router.post('/products', upload.single('image'), createProduct);

// Route pour obtenir tous les produits
router.get('/products', getAllProducts);

// Route pour obtenir un produit par son ID
router.get('/products/:id', getProductById);

// Route pour mettre à jour un produit
router.put('/products/:id', upload.single('image'), updateProduct);

// Route pour supprimer un produit
router.delete('/products/:id', deleteProduct);

module.exports = router;
