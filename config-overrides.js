const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  //针对antd实现按需打包
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirctory: 'es',
    style: true
  }),
  //自定义主题
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#AEEEEE'}
  })
)