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

const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  pages,
  assetsDir: 'foo-assets-dir',
  devServer: {
    index: 'home.html'
  },
  productionSourceMap: false, // 关闭生产sourcemap
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require('postcss-plugin-px2rem')({
          value: 100 // px转换rem，基准值100px
        })]
      }
    }
  },
  configureWebpack: config => {
    let plugins = [];
    // 使用gzip算法进行源文件压缩；
    // 同时需要配置nginx开启读取.gz的配置（gzip_static on）
    if (process.env.NODE_ENV === 'production') {
      plugins.push(new CompressionPlugin({
        algorithm: 'gzip', // 默认就是gzip算法压缩，这里可以不配；默认的压缩级别是9（最高）
        test: /\.(js|css)$/, // 匹配文件名
        threshold: 10240, // 对超过10k的数据压缩
        deleteOriginalAssets: false, // 不删除源文件
        minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理（minRatio = 压缩大小 / 原始大小）
      }));
    }
    return {
      plugins
    };
  }
};
