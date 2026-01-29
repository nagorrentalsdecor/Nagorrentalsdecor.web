import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Note: ESLint and TypeScript ignore options are now handled via CLI or separate config in newer versions
};

export default nextConfig;
