const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const _ = require('lodash');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (config = {}) => {
  return Object.assign({}, config, {
    entry: {
      main: [
        'react-hot-loader/patch',
        'webpack-dev-server/client?http://localhost:9999',
        'webpack/hot/only-dev-server',
        path.resolve(__dirname, 'index.js'),
      ],
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },


    module: {
      rules: [
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                svgo: false,
                modules: true,
                localIdentName: '[name]__[local]__[hash:base64:6]',
                importLoaders: 1,
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: [
            path.resolve(__dirname, 'node_modules'),
          ],
          use: [{
            loader: 'babel-loader',
          }],
        },
      ],
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        },
      }),
      new webpack.LoaderOptionsPlugin({
        options: {
          context: __dirname,
        },
      }),
      new HtmlWebpackPlugin({
        template: 'index.ejs',
        inject: true,
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],

    stats: {
      chunks: false,
      colors: true,
    },

    resolve: {
      modules: [
        'node_modules',
        path.resolve('./src'),
      ],
    },

    devtool: 'inline-source-map',
    devServer: {
      host: '0.0.0.0',
      port: 9999,
      hot: true,
      historyApiFallback: true,
    },
  });
};
