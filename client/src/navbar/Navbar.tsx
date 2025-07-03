"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        { withCredentials: true }
      );
      logout();
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const navLinks = (
    <>
      <Link href="/timeline" onClick={() => setIsOpen(false)}>
        <span className="block md:inline-block text-gray-700 hover:text-purple-700 font-medium transition">
          Timeline
        </span>
      </Link>

      <Link href="/users" onClick={() => setIsOpen(false)}>
        <span className="block md:inline-block text-gray-700 hover:text-purple-700 font-medium transition">
          Users
        </span>
      </Link>
    </>
  );

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-700">
          SocialSphere
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks}

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-700 hover:bg-purple-50"
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-purple-700 hover:text-purple-900 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-3">
          {navLinks}

          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full border-purple-600 text-purple-700 hover:bg-purple-50"
                >
                  Login
                </Button>
              </Link>

              <Link href="/signup" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
