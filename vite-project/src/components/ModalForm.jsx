import React from "react";
import { X } from "lucide-react";
import Swal from "sweetalert2";

const ModalForm = ({ isOpen, onClose, refreshProducts, product, isEditMode = false }) => {
  // Initialiser le state avec les valeurs du produit si en mode édition
  const [newProduct, setNewProduct] = React.useState({
    name: product?.name || "",
    price: product?.price || "",
    category: product?.category || "",
    image: null,
    description: product?.description || "",
  });

  const [imagePreview, setImagePreview] = React.useState(
    product?.imageUrl ? product.imageUrl : null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  // Mettre à jour le state quand le produit à éditer change
  React.useEffect(() => {
    if (product && isEditMode) {
      setNewProduct({
        name: product.name || "",
        price: product.price || "",
        category: product.category || "",
        image: null,
        description: product.description || "",
      });
      setImagePreview(product.imageUrl || null);
    } else {
      // Réinitialiser pour l'ajout
      setNewProduct({
        name: "",
        price: "",
        category: "",
        image: null,
        description: "",
      });
      setImagePreview(null);
    }
  }, [product, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct((prev) => ({
        ...prev,
        image: file,
      }));

      // Créer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = "Le nom est requis";
    if (!newProduct.price) newErrors.price = "Le prix est requis";
    if (newProduct.price && Number(newProduct.price) <= 0)
      newErrors.price = "Le prix doit être positif";
    if (!newProduct.category) newErrors.category = "La catégorie est requise";
    if (!isEditMode && !newProduct.image) newErrors.image = "L'image est requise";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("description", newProduct.description);
      
      // On n'ajoute l'image que si elle a été modifiée ou en mode création
      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }
  
      const url = isEditMode 
        ? `http://localhost:3000/api/products/products/${product.id}`
        : "http://localhost:3000/api/products/products";
        
      const method = isEditMode ? "PUT" : "POST";
  
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Une erreur est survenue.");
      }

   
     
      
      // Afficher SweetAlert avec un message adapté
      await Swal.fire({
        title: "Succès!",
        text: isEditMode 
          ? "Le produit a été modifié avec succès" 
          : "Le produit a été créé avec succès",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#0d9488",
      });
  
      // Réinitialiser le formulaire si en mode ajout
      if (!isEditMode) {
        setNewProduct({
          name: "",
          price: "",
          category: "",
          image: null,
          description: "",
        });
        setImagePreview(null);
      }
  
      // Fermer le modal
      onClose();
      
      // Rafraîchir la liste des produits
      if (refreshProducts) {
        refreshProducts();
      }
    } catch (error) {
      console.error("Erreur lors de la soumission :", error);
      Swal.fire({
        title: "Erreur",
        text: error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm overflow-auto">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Modifier le produit" : "Ajouter un nouveau produit"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-teal-200"
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Prix <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                F CFA
              </span>
              <input
                type="number"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className={`w-full pl-14 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-teal-200"
                }`}
                disabled={isSubmitting}
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.category
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-teal-200"
              }`}
              disabled={isSubmitting}
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="electronique">Électronique</option>
              <option value="vetement">Vêtements</option>
              <option value="alimentation">Alimentation</option>
              <option value="mobilier">Mobilier</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Image du produit {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full"
                disabled={isSubmitting}
              />
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image}</p>
            )}
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Aperçu de l'image :</p>
                <img
                  src={imagePreview}
                  alt="Aperçu du produit"
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
            {isEditMode && !newProduct.image && (
              <p className="mt-2 text-sm text-gray-500">
                Laisser vide pour conserver l'image actuelle
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-200"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  En cours...
                </>
              ) : (
                isEditMode ? "Modifier" : "Ajouter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;