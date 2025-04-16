/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"], // Add your image domains here
  },
  env: {
    API_URL: process.env.API_URL, // Add your API URL here
  },
};

module.exports = nextConfig;
