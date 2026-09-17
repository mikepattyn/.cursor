const target = process.env.BFF_PROXY_TARGET || 'http://localhost:3000';

module.exports = {
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
