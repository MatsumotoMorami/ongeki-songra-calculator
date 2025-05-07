/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true
    },
    // basePath: '/ongeki-songra',
    // assetPrefix: '/ongeki-songra',
    // trailingSlash: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig 