const multer = require('multer');
const path = require('path');

// Configuration du stockage pour les fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Le dossier où les images seront stockées
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Crée un nom unique pour le fichier en ajoutant un timestamp au nom original
    cb(null, Date.now() + path.extname(file.originalname)); // Exemple: 1616183104721.jpg
  }
});

// Filtre les types de fichiers (ici, seulement les images)
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une image'), false);
  }
};

// Crée un middleware multer avec la configuration ci-dessus
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de taille à 5 Mo
});

module.exports = upload;
