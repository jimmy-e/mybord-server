const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'src');

const output = {
  filename: 'index.js',
  path: path.resolve(__dirname, 'dist'),
};

const releaseCreatedAt = new Date(process.env.HEROKU_RELEASE_CREATED_AT);

const plugins = [
  new HtmlWebpackPlugin({
    releaseDate: releaseCreatedAt.toDateString(),
    releaseTime: releaseCreatedAt.toTimeString(),
    releaseVersion: process.env.HEROKU_RELEASE_VERSION,
    template: `${SRC_DIR}/pages/index.html`,
  }),
];

const resolve = {
  extensions: ['.graphql', '.js', '.ts'],
  alias: {
    middleware: path.resolve(SRC_DIR, 'middleware/'),
    schema: path.resolve(SRC_DIR, 'schema/'),
    server: path.resolve(SRC_DIR, 'server/'),
    serverError: path.resolve(SRC_DIR, 'serverError/'),
    types: path.resolve(SRC_DIR, 'types/'),
    utils: path.resolve(SRC_DIR, 'utils/'),
    youtube: path.resolve(SRC_DIR, 'thirdParty/youtube/'),
  },
};

const rules = [
  {
    exclude: [path.resolve(__dirname, 'node_modules')],
    test: /\.ts$/,
    use: 'ts-loader',
  },
  {
    test: /\.graphql$/,
    exclude: /node_modules/,
    use: [
      { loader: 'graphql-tag/loader' },
    ],
  },
];

module.exports = {
  module: { rules },
  output,
  plugins,
  resolve,
  target: 'node',
};
