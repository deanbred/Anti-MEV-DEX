module.exports = {
  webpack: {
    configure: {
      module: {
        rules: [
          {
            test: /\.m?js$/,
            resolve: {
              fallback: {
                path: false,
                os: false,
                crypto: false,
                stream: false,
                assert: false,
              },
            },
          },
        ],
      },
    },
  },
};
