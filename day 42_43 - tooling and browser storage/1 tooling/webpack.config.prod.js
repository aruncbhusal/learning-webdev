/* eslint-disable no-undef */
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: './src/app.js',
    output: {
        filename: '[contenthash].js',
        path: path.resolve(__dirname, 'assets', 'scripts'),
        publicPath: '/assets/scripts/',
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname),
        },
    },
    devtool: 'cheap-source-map',
    plugins: [new CleanPlugin.CleanWebpackPlugin()],
};

// We will build using webpack not dev server so we need to run this using serve

// When we're working with production, users will cache the pages and if name is same they load the scripts from cahce
// which might not be what we want if we have changed something in the files. We can generate new unique names inside filename
// We simply need to add [contenthash].js instead of app.js here. This is not necessary for development
// When we use this in production we also need to update the src attribute inside the html before serving it so that it matches the filename
