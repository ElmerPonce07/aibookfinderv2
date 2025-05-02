"use client"; //again uses client side rendering

import { useEffect } from "react";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth } from "@/lib/firebase";

//use for routher nagivation
import { useRouter } from "next/navigation";

export default function dashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        //if no user is logged in send to login page
        router.push("/login");
      }
    });
    return () => unsubscribe(); //cleanup firebase listener
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth); // sign out using firebase auth
    router.push("/login"); // redirect to login page
  };

  return (
    <main className="p-8">
      {/* 
        Page layout:
        - p-8: padding
      */}
      <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard 📚</h1>
      <p className="text-gray-600 mb-6">
        You're logged in. Feel free to search for book topics!
      </p>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </main>
  );
}
