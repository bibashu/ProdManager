import React, { useContext } from "react";
import { LogOut, PlusCircle, Search, ShoppingBag } from "lucide-react";
import { Button } from "@heroui/button";
import { AuthContext } from "../authContext";

import { useNavigate } from "react-router-dom";

const Header = ({ onAddProduct, onSearch }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  if (!user) {
    navigate("/login");
    return null; // or a loading spinner
  }

  return (
    <header className="bg-white shadow-md py-4 px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center">
          <h1
            className="
  text-2xl md:text-3xl 
  font-bold 
  bg-gradient-to-r from-teal-600 to-teal-400 
  bg-clip-text text-transparent 
  
  font-['Abril_Fatface'] 
  tracking-wide 
  drop-shadow
  leading-tight
"
          >
            Prod-Manager
          </h1>
        </div>

        <div className="flex flex-1 max-w-md relative mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 outline-none"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-amber-100 text-amber-600 rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
            {user.username ? user.username.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <h2 className="text-lg font-semibold capitalize">
              {user.username || "Utilisateur"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
                   
          <Button
            onClick={handleLogout}
            className="text-teal-500 cursor-pointer"
          >
            <LogOut />
          </Button>
        </div>
      

       
      </div>
    </header>
  );
};

export default Header;
