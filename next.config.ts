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
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname:
          process.env.NEXT_PUBLIC_AWS_PUBLIC_URL?.replace("https://", "") ||
          "fallback.local",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
