"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Welcome to SocialSphere
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Connect, share, and discover. Join the community and stay updated with your friends.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="text-purple-600 border-purple-600 hover:bg-purple-50 px-6 py-3 text-lg">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
