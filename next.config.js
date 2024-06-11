/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    rewrites: async () => {
        return [
            {
                source: "/api/:path*",
                destination: "http://api:5000/api/:path*"
            }
        ]
    }
};

module.exports = nextConfig;
