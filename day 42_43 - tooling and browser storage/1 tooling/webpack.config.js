/* eslint-disable no-undef */

// Here module appears as not defined so we can set a new rule for it to not be flagged as an error
// Now for the modules to be loaded automatically we need to put all our scripts in a new folder called src
// Then we can set an entry and output for this project

// We also need to use the built in module for path of output, which we can use using the require function
const path = require('path');
// The resolve method takes arguments, __dirname gives us the root project directory, from which we can add strings as paths into output folder

// Currently each time we build, we create new files inside scripts and the folder might get cluttered so we can install a plugin to save from that
// We need to install clean-webpack-plugin, also @4 and use it inside a plugin array as an entry in module.exports
const CleanPlugin = require('clean-webpack-plugin');

// Normally the mode is set to 'production' so that an optimized script is generated, but we don't want that right now
// We want to just bundle the code, so we can use mode: 'development' to ensure that happens
// Also when building it generates files inside assets/scripts/ but when having to access them after lazy loading, it looks at root folder
// so we need to point the public path to the folder where we have the files
module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'assets', 'scripts'),
        publicPath: '/assets/scripts/',
    },
    devServer: {
        // contentBase: './',
        static: {
            directory: path.resolve(__dirname),
        },
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [new CleanPlugin.CleanWebpackPlugin()],
};

// By adding the "build" script into the "scripts" of package.json we can ensure webpack runs and converts the files in src into bundled code
// The ouput would appear in scripts folder.
// We can run the project using npm run build
// Also had to install webpack-cli@4 for it to not throw an error.
// webpack expects us to not write extensions when importing modules so we need to remove it in each file
// And we don't use fields in class, but instead initialize them inside the constructor as properties
// Also, we aren't supposed to assign function to fields but insted either use function delcarations directly, or we can define method in constructor

// After all that, running 'npm run build' produces two new files called app.js and 1.app.js inside scripts folder
// They are optimized bundles of the code we have in the scripts inside src. We have two files because 1.app.js is later loaded
// because we had implemented "lazy loading" where tooltip module is only imported as necessary

// Not every html page will have the same entry point so we might need to create more bundles
// for that we can specify entry as an object with <route>: <entry_file_for_route>
// A simple rule we can follow is to have one entry point for a single html file
// https://webpack.js.org/guides/code-splitting/
// https://webpack.js.org/concepts/#entry

// When we make changes to files in src/this config, we might need to rebuild it, then we can run it using serve command like before
// But we can avoid that by using webpack-dev-server. We first install it using the same --save-dev flag, with same @4 version spec
// Then we can specify in this file with the devServer object, the location of the html file that is to be run i.e. root folder
// but it is set by default so we don't need to worry about that here.
// It looks like it isn't set by default and is served from the public folder instead, which doesn't exist so we need this
// But the version I used doesn't have a contentBase property so I had to use static with directory property

// We need to go to package.json file and add build:dev inside scripts which has webpack-dev-server as value
// Now any change we make to the files in src will be updated in file in scripts, and the app will be reloaded itself
// We need to run 'npm run build:dev' and keep it running so that the page is available on the address

// Now the next problem is debugging. Since we bundled all things into a single file, it is hard to debug that file in browser
// Though we can find the files in webpack:// inside sources, the files are not the same
// To make debugging easier we need to add a new devtool key to the config object and generate sourcemaps i.e. mapping original files
// We can use the following reference to select the one we need: https://webpack.js.org/configuration/devtool/
// Didn't work for me somehow

// Now for a production environment, we can create a new config file "webpack.config.prod.js" and copy this there
// We can change the mode to production and change devtools to cheap-source-map
// We need to then add a build:prod entry to the scripts where we need to set --config "webpack.config.prod.js" to point to right file
// Else the default of webpack.config.js is used
