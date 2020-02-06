module.exports = {
  rules: [{
    test: /\.less$/,
    use: [{
      loader: 'style-loader',
    }, {
      loader: 'css-loader', // translates CSS into CommonJS
    }, {
      loader: 'less-loader', // compiles Less to CSS
      options: {
        modifyVars: {
          'primary-color': '#FF8C00',
          'link-color': '#FF8C00',
          'border-radius-base': '4px',
          // or
          'hack': `true; @import "your-less-file-path.less";`, // Override with less file
       },
        javascriptEnabled: true,
      },
    }],
    // ...other rules
  }],
  // ...other config
}