// next.config.js
module.exports = {
  reactStrictMode: true,
  transpilePackages: [
    'react-markdown',
    'remark-gfm',
    'unist-util-position',
    'mdast-util-from-markdown',
    'micromark',
    'vfile'
  ],
  experimental: {
    esmExternals: 'loose',
  },
};
