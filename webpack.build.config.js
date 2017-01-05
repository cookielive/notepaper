var webpack = require("webpack");
console.log(__dirname);
module.exports = {
  entry:'./src/index.js',
  output:{
    path:__dirname+'/dist/',
    filename:'app.js'
  },
  resolve: {
    alias:{
      'vue':'vue/dist/vue.js'
    },
     extensions: ['', '.js', '.vue']
  },
  module:{
    loaders:[
      {test:/\.vue$/,loader:'vue'},
      {test:/\.js$/,loader:'babel?presets=es2015',exclude: /node_modules/}
    ]
  },
  devtool: '#source-map',
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}
