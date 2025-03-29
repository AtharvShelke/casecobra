"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaUserPlus } from "react-icons/fa";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }),
    });

    if (response.ok) {
      alert("User created successfully!");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } else {
      alert("Error creating user.");
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white">
      <h2 className="text-black text-2xl font-semibold text-center mb-6">
        Create an Account
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Full Name"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Your Email"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Create Password"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Confirm Password"
          required
        />

        <Button type="submit" className="group h-14 w-full flex items-center justify-center text-white rounded-lg font-bold transition-all focus:ring-2 focus:ring-gray-500">
          Register
          <FaUserPlus className="text-sm transition-all group-hover:translate-x-2 group-hover:-translate-y-1 ml-3" />
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
