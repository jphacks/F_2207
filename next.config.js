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

module.exports = nextConfig
