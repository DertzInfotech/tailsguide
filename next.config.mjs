/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@tensorflow/tfjs': '@tensorflow/tfjs',
    };
    return config;
  },
};

export default nextConfig;
