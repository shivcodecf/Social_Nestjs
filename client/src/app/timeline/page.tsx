"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthGuard from "@/AuthGuard";


function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} year${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} month${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} day${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} hour${interval > 1 ? "s" : ""} ago`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} minute${interval > 1 ? "s" : ""} ago`;

  return "just now";
}

export default function Timeline() {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchPosts = () => {
    axios
      .get("http://localhost:3001/posts/timeline", {
        withCredentials: true,
      })
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load timeline."
        );
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      await axios.post(
        "http://localhost:3001/posts",
        { title, description },
        { withCredentials: true }
      );

      setTitle("");
      setDescription("");
      fetchPosts();
      toast.success("Post created successfully!");
    } catch (err: any) {
      console.error(err);

      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create post.";

      toast.error(`${errorMsg}, Please Login`);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-4 ml-[250px]"
      
      >
        <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-lg tracking-wide">
            Your Timeline
          </h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create a new Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Enter title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Write something..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-28"
                />
                <Button
                  onClick={handleCreatePost}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-8">
          {posts.map((post: any) => (
            <Card key={post._id} className="transition hover:shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src="https://www.w3schools.com/howto/img_avatar.png" />
                  <AvatarFallback className="bg-gray-400 text-white">
                    {post.author?.slice(0, 2)?.toUpperCase() || "AU"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{post.author}</p>
                  <span className="text-gray-400 text-sm">
                    {timeAgo(post.createdAt)}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4">{post.description}</p>
                <div className="flex items-center gap-6 text-gray-500 border-t pt-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12.75v-1.5a3 3 0 013-3H9V4.5a2.25 2.25 0 114.5 0v2.25h4.125a1.125 1.125 0 011.113 1.313l-.667 4.5a1.125 1.125 0 01-1.113.937H13.5V19.5H9v-6.75H5.25a3 3 0 01-3-3z"
                      />
                    </svg>
                    <span>Like</span>
                  </div>

                  <div className="flex items-center gap-1 cursor-pointer hover:text-green-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 8h2a2 2 0 012 2v10l-4-4H7a2 2 0 01-2-2V6a2 2 0 012-2h6"
                      />
                    </svg>
                    <span>Comment</span>
                  </div>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-purple-600">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v16h16V4H4zm4 8h8"
                      />
                    </svg>
                    <span>Share</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
