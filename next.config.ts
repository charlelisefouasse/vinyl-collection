import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://i.scdn.co/image/**"),
      {
        protocol: "https",
        hostname: "atthemoviesshop.com",
        pathname: "/cdn/shop/files/**",
      },
    ],
  },
};

export default nextConfig;
