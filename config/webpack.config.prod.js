const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseConfig = require('./webpack.config.base.js'); // 引用公共的配置

const prodConfig = {
  mode: 'production',
  entry: path.join(__dirname, '../src/index.ts'),
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  plugins: [new CleanWebpackPlugin()],
  optimization: {
    minimize: true,
  },
  externals: {
    // 外部依赖
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
};

module.exports = merge(prodConfig, baseConfig);
