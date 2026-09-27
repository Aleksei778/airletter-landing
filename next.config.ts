import type { NextConfig } from "next"

// Go API. The browser talks to it through /api on this origin, so auth
// cookies are first-party and Google OAuth returns to the same site.
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080"

const nextConfig: NextConfig = {
  output: "standalone",

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
