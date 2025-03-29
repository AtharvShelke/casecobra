'use client';
import { Button } from "@/components/ui/button";
import { FaPaperPlane } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { email, password, callbackUrl: "/" });
  };
  return (

    <div className="w-full max-w-md  p-8 rounded-2xl shadow-lg bg-white">
      <h2 className="text-black text-2xl font-semibold text-center mb-6">Welcome Back</h2>

      <form className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}

          required
        />

        <input
          type="password"
          name="password"
          className="h-14 w-full rounded-lg border border-gray-700  p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <a href="#" className="text-gray-600 text-sm hover:text-gray-200 self-end">Forgot Password?</a>

        <Button type="submit" className="group h-14 w-full flex items-center justify-center  text-white rounded-lg font-bold transition-all focus:ring-2 focus:ring-gray-500 ">
          Login
          <FaPaperPlane className="text-sm transition-all group-hover:translate-x-2 group-hover:-translate-y-1 ml-3" />
        </Button>
      </form>
    </div>

  );
}

export default LoginPage;
