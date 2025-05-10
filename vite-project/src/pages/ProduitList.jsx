import React from "react";

import ProduitCard from "./ProduitCard";

const ProduitList = ({ products, onEdit, onDelete, onAddProduct }) => {
  if (products.length === 0) {
    // return <EmptyState onAddProduct={onAddProduct} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProduitCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProduitList;
