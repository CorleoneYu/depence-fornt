const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  mode: 'development',
  resolve: {
    alias: {
      '@': resolve('src'),
      'common': resolve('src/common'),
      'components': resolve('src/components'),
      'image': resolve('src/asset/image'),
      'api': resolve('src/api'),
      'base': resolve('src/base'),
      'store': resolve('src/store'),
    },
    extensions: ['.js', '.jsx']
  },
  entry: {
    main: [path.resolve(__dirname, './src/main.js')]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js',
    publicPath: '/',
  },
  devServer: {
    port: 3000,
    contentBase: path.resolve(__dirname, './dist'), //指定服务文件
    hot: true, //热更新
    disableHostCheck: true,
    proxy: {
      '/api': 'http://localhost:8081'
    }
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4 * 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4096,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader",  //es6 babel
        },
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[local]--[hash:5]'
            }
          },
          'postcss-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
            },
          },
          {
            loader: 'css-loader',
          },
        ],
        include: /node_modules/,
        exclude: /src/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ]
}