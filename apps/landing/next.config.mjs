/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@couthealth/ui"],
  output: "standalone",
};

export default nextConfig;
