module.exports = {
  presets: [
    ["@babel/preset-env", { modules: false }], // Tree-shaking friendly
    "@babel/preset-react"
  ],
  ignore: [], // Ensures all files are processed
  minified: false, // Disable minification (helps debugging)
};