// Falls back to the live backend if the Vercel variable is missing, and strips
// trailing slashes ("host//api/..." is a 404 in Express). The admin panel does
// NOT use the /s/<site> prefix — it sends the selected website in an
// "x-site" header instead (see src/lib/site.js).
const backendBaseUrl = (
  process.env.BACKEND_API_BASE_URL ||
  "https://hometuitionacademy-backend.onrender.com"
)
  .trim()
  .replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_API_BASE_URL: backendBaseUrl,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },
};

export default nextConfig;
