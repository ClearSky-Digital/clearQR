/** @type {import('next').NextConfig} */
const nextConfig = {
  // A static site: everything runs in the browser, there is no server code.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
