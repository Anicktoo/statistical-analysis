const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerzerWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log(isDev);

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerzerWebpackPlugin()
        ]
    }
    return config;
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoader = extra => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
    },
        'css-loader'
    ]

    if (extra) {
        loaders.push(extra);
    }

    return loaders;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './app.js',
    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    resolve: {
        extensions: ['.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@styles': path.resolve(__dirname, 'src', 'styles'),
            '@img': path.resolve(__dirname, 'src', 'img'),
            '@modules': path.resolve(__dirname, 'src', 'modules'),
            '@data': path.resolve(__dirname, 'src', 'data'),
        }
    },
    optimization: optimization(),
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'src')
        },
        compress: true,
        port: 4200,
        hot: isDev,
        open: true,
    },
    devtool: isDev ? 'source-map' : undefined,
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd,
            }
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                },
                {
                    from: path.resolve(__dirname, 'src/img'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        }),
    ],
    module: {
        rules: [{
            test: /\.css$/,
            use: cssLoader()
        },
        {
            test: /\.scss$/,
            use: cssLoader('sass-loader')
        },
        {
            test: /\.(png|jpg|svg|gif|ttf|woff|woff2|eot)$/,
            type: 'asset/resource'
        }],
    },
}
