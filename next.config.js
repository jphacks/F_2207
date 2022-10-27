const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // compiler: {
  // removeConsole:
  //   process.env.NODE_ENV === "development"
  //     ? undefined
  //     : {
  //         exclude: ["error"],
  //       },
  // },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  experimental: {
    scrollRestoration: true,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
