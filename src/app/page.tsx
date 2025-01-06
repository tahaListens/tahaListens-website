import React from "react";
import LoginButton from "@/components/LoginButton";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Welcome to Taha Listens</h1>
      <p className="mb-4 text-gray-600">Sign in to get started!</p>
      <LoginButton />
    </div>
  );
}
