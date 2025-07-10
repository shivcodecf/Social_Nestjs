"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/auth/logout",
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
    <div className="flex flex-col gap-3">
      <Link href="/timeline" onClick={() => setIsOpen(false)}>
        <span className="text-gray-700 hover:text-purple-700 font-medium transition">
          Timeline
        </span>
      </Link>

      <Link href="/users" onClick={() => setIsOpen(false)}>
        <span className="text-gray-700 hover:text-purple-700 font-medium transition">
          Users
        </span>
      </Link>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
     {/* Desktop sidebar */}
<nav className="hidden md:fixed md:flex top-0 left-0 h-screen w-64 bg-gradient-to-b from-purple-600 to-pink-500 text-white border-r border-gray-200 flex-col justify-between p-6 z-50">
  <div className="flex flex-col gap-8">
    <Link href="/" className="text-2xl font-bold">
      SocialSphere
    </Link>

    <div className="flex flex-col gap-3">
      <Link href="/timeline" onClick={() => setIsOpen(false)}>
        <span className="hover:text-yellow-300 font-medium transition">
          Timeline
        </span>
      </Link>

      <Link href="/users" onClick={() => setIsOpen(false)}>
        <span className="hover:text-yellow-300 font-medium transition">
          Users
        </span>
      </Link>
    </div>
  </div>

  <div className="flex flex-col gap-3">
    {isLoggedIn ? (
      <Button
        onClick={handleLogout}
        className="bg-red-700 hover:bg-red-700 text-white"
      >
        Logout
      </Button>
    ) : (
      <>
        <Link href="/login">
          <Button
            variant="outline"
            className="border-white text-black hover:bg-white hover:text-purple-700 w-full"
          >
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-purple-800 w-full">
            Sign Up
          </Button>
        </Link>
      </>
    )}
  </div>
</nav>


      {/* Mobile navbar */}
      <nav className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-purple-700">
          SocialSphere
        </Link>

        <button
          className="text-purple-700 hover:text-purple-900 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3">
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
    </>
  );
}
