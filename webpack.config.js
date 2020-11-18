// webpack.config.js
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const folderPath = path.resolve(__dirname, "./src/");

module.exports = {
    mode:'development',
    devtool: "source-map",
    entry: {
        css:'./src/assets/scss/style.scss',
        index:'./src/assets/js/app.js',
        about:'./src/assets/js/about.js',
        slider:'./src/assets/js/page_slider.js',
        d3test:'./src/assets/js/d3test.js'
    },
    output: {
        filename:'assets/js/[name].bundle.js',
        path:path.resolve(__dirname, 'dist/'),
        sourceMapFilename: '[file].map'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: false,
        host: 'localhost',
        watchContentBase: true,
        hot: true,
        open: true,
        port: 9800
    },
    module: {
        rules: [
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use: {
                    loader:'babel-loader',
                    options:{
                        sourceMap: true,
                        presets:['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "assets/css/[name].css"
                        }
                    },
                    {
                        loader: "extract-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url : false,
                            sourceMap: true,
                            importLoaders: 2
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: 'inline',
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap:true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title : 'index',
            hash: true,
            template: './src/ejs/index.ejs',
            chunks: ['index'],
            filename:'index.html',
            HTML_PATH: folderPath
        }),

        new HtmlWebpackPlugin({
            title : 'about',
            hash: true,
            template: './src/ejs/index.ejs',
            chunks: ['about'],
            filename:'b.html',
            HTML_PATH: folderPath
        }),

        new HtmlWebpackPlugin({
            title : 'slider',
            hash: true,
            template: './src/ejs/slider.ejs',
            chunks: ['slider'],
            filename:'slider.html',
            HTML_PATH: folderPath
        }),

        new HtmlWebpackPlugin({
            title : 'd3test',
            hash: true,
            template: './src/ejs/d3test.ejs',
            chunks: ['d3test'],
            filename:'d3test.html',
            HTML_PATH: folderPath
        }),

        new HtmlWebpackTagsPlugin({
            hash: true,
            append: true,
            tags: ['./assets/css/style.css']
        })
    ]
};
