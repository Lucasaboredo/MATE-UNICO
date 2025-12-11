const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchFromStrapi(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status} fetching ${path}`);
  }

  return res.json();
}
