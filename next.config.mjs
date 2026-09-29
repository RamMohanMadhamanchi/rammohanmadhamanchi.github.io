/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves static files only.
  output: "export",
  // Emit /projects/slug/index.html so Pages resolves clean URLs.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
