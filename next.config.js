/** @type {import('next').NextConfig} */
const nextConfig = {
  // Deployed on Vercel as a full Next.js app, not a static export.
  // `output: 'export'` was removed because middleware needs a server to run in,
  // and static export ships no server at all.
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
