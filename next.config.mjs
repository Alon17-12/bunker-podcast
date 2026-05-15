/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.b-cdn.net' },
      { protocol: 'https', hostname: 'iframe.mediadelivery.net' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  // typedRoutes intentionally disabled — too many dynamic params (/admin/customers/[id], /admin/episodes/[id], /p/[token])
  // Re-enable once we have a stable route map with proper Route casting in all dynamic Links.
  typedRoutes: false,
};

export default nextConfig;
