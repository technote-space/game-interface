const webpack           = require('webpack');
const path              = require('path');
const NODE_ENV          = process.env.NODE_ENV;
const PROJECT_ROOT      = path.resolve(__dirname, '../../..');
const OUTPUT_DIR        = path.resolve(PROJECT_ROOT, 'build');

module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
    }),
  ],
  mode: NODE_ENV,
  performance: {
    hints: false,
    maxEntrypointSize: 5000000,
    maxAssetSize: 5000000,
  },
  stats: {
    colors: true,
  },
  entry: {
    index: path.resolve(PROJECT_ROOT, 'src/index'),
  },
  output: {
    path: OUTPUT_DIR,
    filename: '[name].js',
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: require('./babel.config'),
        },
      },
    ],
  },
};
