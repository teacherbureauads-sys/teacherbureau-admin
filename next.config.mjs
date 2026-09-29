// ---- Multi-site setup -------------------------------------------------------
// All websites share ONE backend + database + admin panel. Each website tells
// the backend which site's data it wants through SITE_KEY. The key must match
// a website added in the admin panel (Websites page).
//   Vercel > Settings > Environment Variables:  SITE_KEY = teachersbureau
const DEFAULT_SITE_KEY = "teachersbureau";
const DEFAULT_BACKEND = "https://hometuitionacademy-backend.onrender.com";

const siteKey = (process.env.SITE_KEY || DEFAULT_SITE_KEY).trim().toLowerCase();

// Trailing slashes are stripped ("host//api/..." is a 404 in Express).
let backendBase = (process.env.BACKEND_API_BASE_URL || DEFAULT_BACKEND)
  .trim()
  .replace(/\/+$/, "");

// Every request from this site goes to <backend>/s/<siteKey>/api/...
if (!/\/s\/[a-z0-9-]+$/.test(backendBase)) {
  backendBase = `${backendBase}/s/${siteKey}`;
}
const backendBaseUrl = backendBase;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      {
        protocol: "https",
        hostname: "images.itsoftworld.com",
      },
      {
        protocol: "https",
        hostname: "images.itsoftworld.com",
      },
    ],
  },
  env: {
    BACKEND_API_BASE_URL: backendBaseUrl,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

export default nextConfig;
