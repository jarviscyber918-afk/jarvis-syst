import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // Base headers applied in all environments
    const baseHeaders = [
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];

    // Strict HSTS only in production
    const hstsHeader = process.env.NODE_ENV === "production" ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] : [];

    // Content-Security-Policy: tighter in production, more permissive in development to avoid breaking dev tooling
    const cspDev = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; frame-ancestors 'self';";
    const cspProd = "default-src 'self'; script-src 'self'; connect-src 'self' https:; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; frame-ancestors 'self';";

    const cspHeader = { key: 'Content-Security-Policy', value: process.env.NODE_ENV === 'production' ? cspProd : cspDev };

    return [
      {
        source: '/(.*)',
        headers: [
          ...baseHeaders,
          ...hstsHeader,
          cspHeader,
        ],
      },
    ];
  },
};

export default nextConfig;
