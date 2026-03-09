import { fetchFromStrapi } from "./api";

export async function getProfile() {
  const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
  if (!token) return null;

  try {
    // Usamos tu fetchFromStrapi con Cache Buster
    return await fetchFromStrapi("/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    return null;
  }
}

export function getToken() {
  if (typeof window !== "undefined") return localStorage.getItem("jwt");
  return null;
}