import type { NextConfig } from "next";

// Security headers (brief section 11.6). Referrer-Policy: no-referrer is
// essential: the quick-exit destination must never learn this app's address.
const securityHeaders = [
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  // Cache Components are intentionally off: the app is a single dynamic page
  // plus one stateless API route; nothing here should be cached or prerendered
  // in a way that could retain user input.
  cacheComponents: false,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Make sure the vetted content and config files are bundled with the
  // serverless function on Vercel (brief step 6.4).
  outputFileTracingIncludes: {
    "/api/chat": ["./content/**/*", "./config/**/*"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
