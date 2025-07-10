"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3001/auth/logout",
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("isLoggedIn");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return logout;
}
