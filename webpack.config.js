const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const webpack = require("webpack")
const Friendly = require("@nuxt/friendly-errors-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpackBar = require('webpackbar')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    mode: 'production',
    entry: {
        "wformhand": __dirname + "/src/main.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'wformhand.js',
        library: 'wformhand', // 模块名
        libraryTarget: 'umd', // 将你的 library 暴露为所有的模块定义下都可运行的方式。这样你就可以直接引入模块，模块名是library的值
    },
    devServer: {
        historyApiFallback: true,
        port: process.env.POST,
        hot: true,
        open: false,
        compress: true,
    },
    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            // 'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
        }
    },
    module: {
        rules: [
            {
                test: /.(jpg|png|jpeg|gif)$/,
                loader: "url-loader",
                options: {
                    limit: 10240,
                    esModule: true,
                    name: "static/images/[name].[hash:8].[ext]"
                },
                exclude: /node_modules/
            },
            {
                test: /\.vue$/i,
                loader: "vue-loader"
            },
            {
                test: /\.(css|scss)/,
                use: ['style-loader', "css-loader", "sass-loader"],
            },
            {
                test: /\.(js)/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: [
                        ["@babel/plugin-proposal-class-properties", { "loose": true }],
                        ["@babel/plugin-proposal-private-methods", { "loose": true }],
                        ["@babel/plugin-proposal-private-property-in-object", { "loose": true }]
                    ]
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: 'wformhand.css'
        // }),
        new VueLoaderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // @ts-ignore
        new webpackBar({
            name: "咻咻咻咻-------",
            color: 'green',
            basic: false,
            // reports:[]//自定义
        }),
        new Friendly({
            compilationSuccessInfo: {
                messages: ['    http://localhost:' + process.env.POST]
            }
        }),
    ],
    // optimization: {
    //     runtimeChunk: 'single',// webpack 5 解决vue热更新失效
    // },
    stats: 'errors-only',//只显示编译错误信息
}