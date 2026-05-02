import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // In dev, keep on-demand-compiled chunks alive much longer so the browser
  // never asks for a hash that's already been garbage-collected. This is
  // what causes the "/_next/static/chunks/...js 404" errors.
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // 1 hour (default 25s)
    pagesBufferLength: 10,           // keep last 10 pages compiled (default 2)
  },

  // Belt-and-braces: tell the browser never to cache HTML/JS in dev. The
  // dev server already does this for most assets, but Comet/Chrome are
  // sometimes aggressive — being explicit guarantees no stale-cache 404s.
  async headers() {
    if (!isDev) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, max-age=0" },
          { key: "Pragma",        value: "no-cache" },
          { key: "Expires",       value: "0" },
        ],
      },
    ];
  },
};

export default nextConfig;
