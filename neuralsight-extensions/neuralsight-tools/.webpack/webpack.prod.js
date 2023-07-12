//TODO: look at this it does not work in prod as is https://hashinteractive.com/blog/webpack-configuration-for-react-and-tailwindcss/

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const webpackCommon = require('./../../../.webpack/webpack.base.js');
const pkg = require('../package.json');

const outputFile = 'index.umd.js';
const rootDir = path.resolve(__dirname, '../');
const outputFolder = path.join(__dirname, `../dist/umd/${pkg.name}/`);

// Todo: add ESM build for the extension in addition to umd build

module.exports = (env, argv) => {
  const commonConfig = webpackCommon(env, argv, { SRC_DIR, DIST_DIR, ENRTY });
  return merge(commonConfig, {
    mode: 'production',
    entry: rootDir + '/' + pkg.module,
    devtool: 'source-map',
    output: {
      path: outputFolder,
      filename: outputFile,
      library: pkg.name,
      libraryTarget: 'umd',
      chunkFilename: '[name].chunk.js',
      umdNamedDefine: true,
      globalObject: "typeof self !== 'undefined' ? self : this",
    },
    externals: [
      {
        react: {
          root: 'React',
          commonjs2: 'react',
          commonjs: 'react',
          amd: 'react',
        },
        '@ohif/core': {
          commonjs2: '@ohif/core',
          commonjs: '@ohif/core',
          amd: '@ohif/core',
          root: '@ohif/core',
        },
        '@ohif/ui': {
          commonjs2: '@ohif/ui',
          commonjs: '@ohif/ui',
          amd: '@ohif/ui',
          root: '@ohif/ui',
        },
      },
    ],
    module: {
      rules: [
        {
          test: /(\.jsx|\.js|\.tsx|\.ts)$/,
          loader: 'babel-loader',
          exclude: /(node_modules|bower_components)/,
          resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      ],
    },
    resolve: {
      modules: [path.resolve('./node_modules'), path.resolve('./src')],
      extensions: ['.json', '.js', '.jsx', '.tsx', '.ts'],
    },
    // plugins
    plugins: [
      // While writing your code, you may have already added many code split points to load stuff on demand.
      // After compiling you might notice that some chunks are too small - creating larger HTTP overhead.
      // LimitChunkCountPlugin can post-process your chunks by merging them.
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, //maximum chucks 1
      }),

      // This plugin extracts CSS into separate files.
      // It creates a CSS file per JS file which contains CSS.
      // It supports On-Demand-Loading of CSS and SourceMaps.
      new MiniCssExtractPlugin({
        filename: `./dist/${outputName}.css`,
        chunkFilename: `./dist/${outputName}.css`,
      }),
    ],
  });
};
