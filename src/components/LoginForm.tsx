"use client";
import { Button } from "@/components/ui/button";
import { FaPaperPlane } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      setLoading(true);

      const loginData = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn Response:", loginData);

      if (loginData?.error) {
        console.error("Login error:", loginData.error);
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      if (loginData?.ok) {
        // Give NextAuth time to establish session
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const configurationId = localStorage.getItem("configurationId");

        if (configurationId) {
          console.log("Configuration ID found:", configurationId);
          router.push(`/configure/preview?id=${configurationId}`);
        } else {
          console.log("No Configuration ID found, redirecting...");
          router.push("/");
        }
        
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl shadow-lg bg-white">
      <h2 className="text-black text-2xl font-semibold text-center mb-6">
        Welcome Back
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        
        <input
          type="email"
          name="email"
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          name="password"
          className="h-14 w-full rounded-lg border border-gray-700 p-4 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <a
          href="#"
          className="text-gray-600 text-sm hover:text-gray-800 self-end"
        >
          Forgot Password?
        </a>

        <Button
          type="submit"
          className="group h-14 w-full flex items-center justify-center text-white rounded-lg font-bold transition-all focus:ring-2 focus:ring-gray-500"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
          <FaPaperPlane className="text-sm transition-all group-hover:translate-x-2 group-hover:-translate-y-1 ml-3" />
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
