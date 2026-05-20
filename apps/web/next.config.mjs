/** @type {import('next').NextConfig} */
const apiV1BaseUrl = process.env.NEXT_PUBLIC_API_V1_BASE_URL ?? 'https://api.fairmeme.io/api/v1';
const apiV2BaseUrl = process.env.NEXT_PUBLIC_API_V2_BASE_URL ?? 'https://airdrop.fairmeme.io';

const nextConfig = {
    reactStrictMode: false,
    webpack: (config) => {
        config.externals.push('pino-pretty', 'lokijs', 'encoding');
        return config;
    },
    typescript: { ignoreBuildErrors: true },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fairmeme-bucket.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'gateway.pinata.cloud',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'img.fairmeme.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ipfs.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'fairmeme-bucket-1.s3.ap-southeast-1.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com',
                port: '',
                pathname: '/profile_images/**',
            },
        ],
    },
    async rewrites() {
        return process.env.NEXT_PUBLIC_ENV === 'test'
            ? [
                  {
                      source: '/api/v1/:path*',
                      destination: `${apiV1BaseUrl}/:path*`,
                  },
                  {
                      source: '/api/v2/:path*',
                      destination: `${apiV2BaseUrl}/:path*`,
                  },
              ]
            : [
                  {
                      source: '/api/v1/:path*',
                      destination: `${apiV1BaseUrl}/:path*`,
                  },
                  {
                      source: '/api/v2/:path*',
                      destination: `${apiV2BaseUrl}/:path*`,
                  },
              ];
    },
};

export default nextConfig;
