### Steps Followed To Deploy React Based App To the Local ICP
1. First I created a new project using `dfx new dkeeper`
2. Next we need to remove the files inside src/dkeeper_assets, importantly html, css and js and replace with our Keeper project
The html and js are in the src folder, along with the components, css in assets folder, index.js renamed to index.jsx
3. Since we need to work with typescript support, we need to copy the provided tsconfig.json file into the root folder
4. Then we can copt the contents of the package.txt file into the package.json. I made sure to change webpack-cli version to 4.10.0
5. In the webpack.config.js, inside module.exports.entry we replace js with jsx as extension
6. In the same file, we uncomment the lines above the plugins object
7. Finally, I delete the node_modules folder and reinstall using npm_install. Then create the web app to run

### Persisting(Storing) the data on the canister
#### 1. Creating a new note on the backend
The code is in the main.mo file. I will only list the steps. The acutal commentary will be along with the actual code.
#### 2. Reading notes from the backend
#### 4. Delete notes from the backend
Since we don't have update notes functionality, we end up with CRD