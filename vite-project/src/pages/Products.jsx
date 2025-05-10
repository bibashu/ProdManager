import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProduitList from "./ProduitList";
import ModalForm from "../components/ModalForm";
import Swal from "sweetalert2";
import { Button } from "@heroui/button";
import { PlusCircle } from "lucide-react";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const refreshProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/products/products"
      );
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } else {
        throw new Error("Erreur lors du chargement des produits");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors du chargement des produits.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Voulez-vous vraiment supprimer ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/products/products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        Swal.fire({
          title: "Produit supprimé!",
          text: "Le produit a été supprimé avec succès.",
          icon: "success",
        });
        setProducts(products.filter((product) => product.id !== id));
      } else {
        const data = await response.json();
        Swal.fire({
          title: "Erreur",
          text: `Erreur: ${data.message}`,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue.",
        icon: "error",
      });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const onAddProduct = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };
  return (
    <div>
      <Header
        onAddProduct={() => {
          setProductToEdit(null);
          setIsModalOpen(true);
        }}
        onSearch={handleSearch}
      />
      <div className="flex justify-end items-center p-4">
        <Button
          onClick={onAddProduct}
          className="bg-teal-600 cursor-pointer hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
        >
          <PlusCircle /> Ajouter un produit
        </Button>
      </div>
      <div className="relative text-center py-4 border-t border-b border-gray-300">
        <h1
          className="text-2xl text-center px-4 relative inline-blockbg-white font-bold font-playfair tracking-wider"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Liste des Produits
        </h1>
      </div>

      {/* Affichage conditionnel du message ou de la liste */}
      {filteredProducts.length === 0 && searchTerm ? (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">
            Aucun produit ne correspond à votre recherche "{searchTerm}"
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Réinitialiser la recherche
          </button>
        </div>
      ) : (
        <ProduitList
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={productToEdit}
        refreshProducts={refreshProducts}
        isEditMode={!!productToEdit}
      />
    </div>
  );
};
