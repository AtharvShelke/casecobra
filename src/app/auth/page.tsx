'use client';
import LoginPage from "@/components/LoginForm";
import RegisterPage from "@/components/RegisterForm";
import { useState } from "react";

const Page = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      {isLogin ? <LoginPage /> : <RegisterPage />}
      <button 
        onClick={() => setIsLogin(!isLogin)} 
        className="mt-4 text-blue-500 hover:underline">
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>
    </div>
  );
};

export default Page;
