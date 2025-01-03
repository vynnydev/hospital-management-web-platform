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
        REPLICATE_API_TOKEN: process.env.REPLICATE_API_TOKEN,
        HF_MAX_REQUESTS_PER_MINUTE: process.env.HF_MAX_REQUESTS_PER_MINUTE,
        HF_RATE_LIMIT_DELAY: process.env.HF_RATE_LIMIT_DELAY,
        HF_CONCURRENT_REQUESTS: process.env.HF_CONCURRENT_REQUESTS,
    },
};