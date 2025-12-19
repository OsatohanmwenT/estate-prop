import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      // Keep ImageKit API routes on Next (do not proxy to backend)
      {
        source: "/api/imagekit/:path*",
        destination: "/api/imagekit/:path*",
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Proxy to backend
      },
    ];
  },
};

export default nextConfig;
