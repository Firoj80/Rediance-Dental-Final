import type from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-5295d690-c88e-4a61-afb2-8fde96930e9a.space-z.ai",
    "*.space-z.ai",
    "localhost",
    "127.0.0.1",
  ],
  experimental: {
    allowedOrigins: [
      "preview-chat-5295d690-c88e-4a61-afb2-8fde96930e9a.space-z.ai",
      "*.space-z.ai",
    ],
  },
};

export default nextConfig;
