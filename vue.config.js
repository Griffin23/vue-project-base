const glob = require('glob'); // 匹配文件的工具

const pages = {};
let pageDir = 'src/pages/*';
let entries = glob.sync(`${pageDir}/*.js`);
let entriesPattern = /src\/pages\/.*?\/(.*).js/;

// 多页面配置
entries.forEach((jsFilePath) => {
  let pageName = entriesPattern.exec(jsFilePath)[1];
  pages[pageName] = {
    entry: jsFilePath,
    template: 'src/template.html',
    filename: `${pageName}.html`
  };
});

module.exports = {
  pages,
  devServer: {
    index: 'home.html'
  },
  productionSourceMap: false // 关闭生产sourcemap
};
