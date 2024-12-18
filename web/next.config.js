module.exports = {
    eslint: {
        ignoreDuringBuilds: true,
    },
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
        HUGGING_FACE_API_KEY: process.env.HUGGING_FACE_API_KEY,
    },
};