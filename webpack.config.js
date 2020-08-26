const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
// const CopyWebpackPlugin       = require('copy-webpack-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const ExtractCssChunks        = require('extract-css-chunks-webpack-plugin');
const WriteFilePlugin         = require('write-file-webpack-plugin'); 
const TerserPlugin            = require('terser-webpack-plugin');
const webpack                 = require('webpack');
const path                    = require('path');

const IS_DEV = process.env.NODE_ENV !== 'production';

module.exports = {
	context: path.resolve(__dirname, './src'),
	mode: process.env.NODE_ENV,
	devtool: IS_DEV ? 'source-map' : '',
	entry: './index.tsx',
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		filename: `js/[${IS_DEV ? 'name' : 'hash'}].js`,
		chunkFilename: `js/[${IS_DEV ? 'name' : 'contenthash'}].js`,
		path: path.resolve(__dirname, './build')

	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env',
							'@babel/preset-typescript',
							'@babel/preset-react'
						],
						plugins: ['@babel/plugin-syntax-dynamic-import']
					}
				}
			},
			{
				test: /\.css$/i,
				use: [
					{
						loader: ExtractCssChunks.loader,
						options: {
							hmr: IS_DEV
						}
					},
					{
						loader: 'css-modules-typescript-loader',
						options: {
							mode: process.env.CI ? 'verify' : 'emit'
						}
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							esModule: true
						}
					}
				],
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Portfolio - Railly Koeiman'
		}),
		new ExtractCssChunks({
			chunkFilename: `css/[${IS_DEV ? 'name' : 'contenthash'}].css`
		}),
		new WriteFilePlugin({ test: /^((?!hot-update).)*$/g }),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.DefinePlugin({
			"process.env": {
				"NODE_ENV": `'${process.env.NODE_ENV}'`
			}
		})
	],
	optimization: {
		moduleIds: 'hashed',
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0
		},
		minimizer: [
			new TerserPlugin({
				terserOptions: { output: { comments: false } }
			}),
			new OptimizeCssAssetsPlugin({
				cssProcessorPluginOptions: {
					preset: ['default', { discardComments: { removeAll: true } }],
				}
			}),
		],
	},
	devServer: {
		historyApiFallback: true,
		host: '0.0.0.0',
		port: '8080',
		hot: true,
		overlay: {
			warnings: IS_DEV,
			errors: true
		}
	}
};