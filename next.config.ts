import type { NextConfig } from "next"

// Go API. The browser talks to it through /api on this origin, so auth
// cookies are first-party and Google OAuth returns to the same site.
// It is baked into the build, so a missing value on Vercel would silently
// proxy to localhost: fail the build instead.
if (process.env.VERCEL && !process.env.BACKEND_URL) {
  throw new Error("BACKEND_URL is not set: add it in Vercel project settings (Environment Variables)")
}
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080"

const nextConfig: NextConfig = {
  // standalone server is for Docker; Vercel builds its own output
  output: process.env.VERCEL ? undefined : "standalone",

  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }]
  },

  async redirects() {
    return [
      // paths the backend redirects to after Google sign-in
      { source: "/profile", destination: "/dashboard", permanent: false },
      { source: "/:lang(ru|en)/profile", destination: "/:lang/dashboard", permanent: false },
      { source: "/auth/login", destination: "/login", permanent: false },
    ]
  },
}

export default nextConfig
