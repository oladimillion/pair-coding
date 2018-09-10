const path = require("path");
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
	entry: [
		"./client/src/app/index.js"
	],
	output: { // define where to save js file
		filename: "bundle.js",
		path: path.resolve(__dirname, "client/dist/js/")
	},
	module: {

		rules: [

			{
				/*
					Rules for JavaScript transpiling go in here
				*/
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				include: path.resolve(__dirname, "client")
			},

			{ // css loader for webpack
				test: /\.css$/,
				loader: "css-loader"
			},

			//{ // sass / scss loader for webpack
			//	test: /\.scss$/,
			//	loader: ExtractTextPlugin.extract(["css-loader", "sass-loader"])
			//},

			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					minimize: true,
				}
			}
		]
	},
	resolve: {
		extensions: [".js", ".jsx"]
	},
	plugins: [
		//	new ExtractTextPlugin({ // define where to save css file
		//		filename: path.resolve(__dirname, "client/dist/css/bundle.css"),
		//		allChunks: true
		//	}),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.optimize.UglifyJsPlugin()
    // new UglifyJSPlugin(), 
  ],
  devServer: {
    hot: true,
    inline: true,
    port: 9000,
    historyApiFallback: true,
    contentBase: [
      path.resolve(__dirname, "server"),
      path.resolve(__dirname, "template"),
      path.resolve(__dirname, "client")
    ]
  }
};
