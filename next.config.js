const path = require('path');

module.exports = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@components': path.resolve(__dirname, 'src/app/Components'),
      '@lib': path.resolve(__dirname, 'src/lib'),
    };

    return config;
  },
  images: {
    domains: ['images.pexels.com'], 
  },
};