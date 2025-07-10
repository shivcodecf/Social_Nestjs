"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import background from "../../public/background2.jpeg";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center px-4"
     style={{
        backgroundImage: `url(${background.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center max-w-xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg tracking-wide">
           SocialSphere
        </h1>

        <p className="text-zinc-600 text-lg mb-8">
          Connect, share, and discover. Join the community and stay updated with
          your friends.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-lg">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className="text-purple-600 border-purple-600 hover:bg-purple-50 px-6 py-3 text-lg"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
