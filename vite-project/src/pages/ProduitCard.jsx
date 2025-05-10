import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@heroui/button";
import { motion } from "framer-motion";

const ProduitCard = ({ product, onEdit, onDelete }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price);
  };

  // Variantes d'animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: { scale: 1.02 }
  };

  const imageVariants = {
    hover: { scale: 1.05 }
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full mt-10"
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
    >
      <motion.div 
        className="h-48 overflow-hidden relative group"
        variants={imageVariants}
      >
        <img
          src={`http://localhost:3000${product.image_url}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </motion.div>
      
      <motion.div 
        className="bg-orange-400 text-white w-20 p-1 rounded-full font-bold capitalize text-xs absolute"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        {product.category}
      </motion.div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="mb-2 flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {product.name}
          </h3>
          <motion.span 
            className="text-teal-600 font-bold"
            whileHover={{ scale: 1.1 }}
          >
            {formatPrice(product.price)}
          </motion.span>
        </div>

        <p className="text-gray-600 text-sm  line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex flex-col space-y-2 mt-auto">
          <div className="flex justify-evenly space-x-2 mt-2">
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onEdit(product)}
                className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-600 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => onDelete(product.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProduitCard;