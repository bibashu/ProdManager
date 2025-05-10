import React, { useState } from "react";
import Swal from "sweetalert2";

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Inscription réussie !",
          text: "Votre compte a été créé avec succès.",
          confirmButtonColor: "#d97706", // amber-600
        });
        setFormData({ username: "", email: "", password: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message || "Une erreur est survenue lors de l'inscription.",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur réseau est survenue. Veuillez réessayer.",
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg w-full max-w-md shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-amber-600">Inscription</h1>
        <p className="text-gray-600 mt-2">
          Créez votre compte en quelques secondes
        </p>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base rounded-md border text-black border-gray-300 shadow-sm 
            focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
            transition duration-200 placeholder-gray-400"
        />

        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base rounded-md border text-black border-gray-300 shadow-sm 
            focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
            transition duration-200 placeholder-gray-400"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 text-base text-black rounded-md border border-gray-300 shadow-sm 
            focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200
            transition duration-200 placeholder-gray-400"
        />

        <button
          type="submit"
          className="mt-4 bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
        >
          S'inscrire
        </button>

        <div className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{" "}
          <a href="#" className="text-amber-600 font-medium hover:underline">
            Se connecter
          </a>
        </div>
      </form>
    </div>
  );
};
