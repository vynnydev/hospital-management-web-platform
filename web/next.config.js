module.exports = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback = {
            fs: false,
            path: false,
            crypto: false,
          };
        }
        return config;
    },
    env: {
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
    },
};