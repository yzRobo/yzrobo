/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors. This is commonly used in production
    // environments where linting is handled separately in CI/CD pipelines.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig