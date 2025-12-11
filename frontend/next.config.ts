import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // usamos las imágenes tal cual, sin procesamiento de Next
  },
};

export default nextConfig;
