module.exports = {
  entry: "./pacxon.js",
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  devtool: 'source-maps'
};
