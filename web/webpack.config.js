/**
 * Created by zhengquanbai on 16/9/29.
 */
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var LessPluginCleanCSS = require('less-plugin-clean-css');
const WebpackBrowserPlugin = require('webpack-browser-plugin');
var production = process.env.NODE_ENV === 'production';
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name:      'main', // Move dependencies to our main file
        children:  true, // Look for common dependencies in all children,
        minChunks: 2, // How many times a dependency must come up before being extracted
    }),
    new ExtractTextPlugin("stylesheets/styles.css", {allChunks: true})
];

if (!production) {
    plugins.push(
        new WebpackBrowserPlugin({
            port: 9090,
            url: 'http://localhost'
        })
    );
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
    plugins.push(
        new HtmlWebpackPlugin({
            template: './resources/index.html'
        })
    );
    plugins.push(
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    );
} else {
    plugins = plugins.concat([
        // Cleanup the builds/ folder before
        // compiling our final assets
        new CleanPlugin('builds'),

        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),

        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),

        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),

        // This plugin minifies all the Javascript code of the final bundle
        new webpack.optimize.UglifyJsPlugin({
            mangle:   true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // This plugins defines various variables that we can set to false
        // in production to avoid code related to them from being compiled
        // in our final bundle
        new webpack.DefinePlugin({
            __SERVER__:      !production,
            __DEVELOPMENT__: !production,
            __DEVTOOLS__:    !production,
            'process.env':   {
                BABEL_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
    ]);
}
module.exports = {
    // context: __dirname + "/src",
    entry: [
        'webpack-dev-server/client?http://localhost:9090',
        'webpack/hot/only-dev-server', "babel-polyfill",
        "./src/app.js"],
    output: {
        path: path.join(__dirname, 'resources/builds'),
        filename: "bundle.js",
        chunkFilename: '[name]-[chunkhash].js',
        publicPath: 'builds/'
    },
    devServer: {
        hot: true,
        proxy: {
            '/api/*': 'http://localhost:8080'
        }
    },
    debug: !production,
    devtool: production ? false : 'source-map',
    module: {
        loaders: [
            {
                test: [/\.js$/, /\.es6$/],
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel-loader']
            },
            // { // This loader is commented out because we are using extract text plugin down below.
            //     test: [/\.scss/, /\.css/],
            //     loader: 'style!css!sass',
            // },
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            {
                test: /\.html/,
                loader: 'raw-loader',
            },
            {
                test:   /\.(png|gif|jpe?g|svg)$/i,
                loader: 'url?limit=10000',
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.scss$/i,
                loader: ExtractTextPlugin.extract(['css','sass'])
            },
        ]
    },
    sassLoader: {
        includePaths: [
            path.resolve(__dirname, "./node_modules/compass-mixins/lib"),
            path.resolve(__dirname, "./sass-mixins")
        ]
    },
    lessLoader: {
        lessPlugins: [
            new LessPluginCleanCSS({advanced: true})
        ]
    },
    resolve: {
        extensions: ['', '.js', '.es6', '.scss', '.less', '.css'],
        root: [
            path.resolve('./src'),
            path.resolve('./css')
        ]
    },
    plugins: plugins
};
