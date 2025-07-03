"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/me", {
        withCredentials: true,
      })
      .then((res) => {
        const username = res.data.username || res.data.name;
        setCurrentUsername(username);
        setFollowing(res.data.following || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!currentUsername) return;

    axios
      .get("http://localhost:3000/users", {
        withCredentials: true,
      })
      .then((res) => {
        const filteredUsers = res.data.filter(
          (user: any) => (user.username || user.name) !== currentUsername
        );
        setUsers(filteredUsers);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [currentUsername]);

  const handleFollow = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:3000/users/${username}/follow`,
        {},
        { withCredentials: true }
      );
      setFollowing((prev) => [...prev, username]);
    } catch (err) {
      console.error(err);
      alert("Error following user");
    }
  };

  const handleUnfollow = async (username: string) => {
    try {
      await axios.post(
        `http://localhost:3000/users/${username}/unfollow`,
        {},
        { withCredentials: true }
      );
      setFollowing((prev) => prev.filter((u) => u !== username));
    } catch (err) {
      console.error(err);
      alert("Error unfollowing user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4">
      <div className="flex justify-center mb-10">
        <Link
          href="/timeline"
          className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Go to Timeline
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
        People You May Know
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {users.map((user) => {
          const displayName = user.username || user.name;
          if (!displayName) return null;

          return (
            <Card key={user._id} className="hover:shadow-xl transition duration-300 w-[200px]">
              <CardHeader className="flex items-center justify-center"> 
                <Avatar className="w-16 h-16">
                  <AvatarImage src="" alt={displayName} />
                  <AvatarFallback className={following.includes(displayName)
                    ? "bg-green-500 text-white"
                    : "bg-yellow-400 text-white"}>
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent className="text-center space-y-2">
                <CardTitle className="text-lg">{displayName}</CardTitle>
                {/* <p className="text-gray-500 text-sm">{user.email}</p> */}
                {following.includes(displayName) ? (
                  <Button
                    variant="default"
                    className="bg-zinc-500  w-[120px]"
                    onClick={() => handleUnfollow(displayName)}
                  >
                    Following
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    className="bg-blue-600  w-[120px]"
                    onClick={() => handleFollow(displayName)}
                  >
                    Follow
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
