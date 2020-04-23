const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

/*
 * We've enabled ExtractTextPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 *
 */

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: '[name].[hash].bundle.js',
		path: path.resolve(__dirname, 'cchess')
	},
    //devServer: {
        //contentBase: './cchess'
    //},
    devtool: 'eval-source-map',
	module: {
		rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',

				options: {
					presets: ['env']
				}
			},{
				test: /\.css$/,
				exclude: /node_modules/,
				use: ExtractTextPlugin.extract({
                    //use: [
                        //{
                            //loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                            //options: {
                                //sourceMap: true
                            //}
                        //}
                    //],
					fallback: 'style-loader',
                    use: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
				})
            },{
                test: /\.css$/,
                include: /node_modules/,
                use: [ 'style-loader', 'css-loader' ]
            },{
                test: /\.png$/,
                use: 'file-loader?limit=8192&name=images/[hash:8].[name].[ext]'
            }]
	},

	plugins: [
		//new UglifyJSPlugin(),
        new ExtractTextPlugin({
            filename : 'styles.[hash].css',
            allChunks : true
        }),
        new HtmlWebPackPlugin({
            filename:'index.html',
            template:'src/index.html',
            title:'My React Webpack Demo'
        }),
        //new webpack.EvalSourceMapDevToolPlugin({
            //filename: '[name].js.map'
        //})
    ],
    node: {
        fs: 'empty',
        tls: 'empty',
        net: 'empty'
    }
};
