const VueFilenameInjector = require('./tools/vue-filename-injector')

// 拼接路径
const resolve = dir => require('path').join(__dirname, dir)

// 增加环境变量
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_BUILD_TIME = require('dayjs')().format('YYYY-M-D HH:mm:ss')
// 基础路径 注意发布之前要先修改这里
let publicPath = process.env.VUE_APP_BASE_URL

module.exports = {
  publicPath:publicPath,
  // baseUrl:publicPath, // 根据你的实际情况更改这里
  lintOnSave: true,
  devServer: {

    publicPath:publicPath, // 和 publicPath 保持一致
    proxy: {
      '/api': {
        // target: 'https://result.eolinker.com/nw4JNpZd854dddc83b53ca8f65d6aa33f5ddbfe20d420e8?uri=',
        target: 'https://result.eolinker.com/SSn5AuU5fa51ddababb58a0370bc6211478ffd8d9a8ca24?uri=',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''    //代理的路径
        }
      },
      '/test': {
        target: 'https://www.linchongpets.com/lpCmsTest',
        // target: 'http://192.168.0.110:8095/lpCmsTest',
        changeOrigin: true,
        pathRewrite: {
          '^/test': ''    //代理的路径
        }
      },
    },
  },

  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        data: `@import '~@/assets/style/public.scss';`
      }
    }
  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    /**
     * 删除懒加载模块的 prefetch preload，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#preload
     * 而且预渲染时生成的 prefetch 标签是 modern 版本的，低版本浏览器是不需要的
     */
    config.plugins
      .delete('prefetch')
      .delete('preload')
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    config
      // 开发环境
      .when(process.env.NODE_ENV === 'development',
        // sourcemap不包含列信息
        config => config.devtool('cheap-source-map')
      )
      // TRAVIS 构建 vue-loader 添加 filename
      .when(process.env.VUE_APP_BUILD_MODE === 'TRAVIS' || process.env.NODE_ENV === 'development',
        VueFilenameInjector(config, {
          propName: process.env.VUE_APP_SOURCE_VIEWER_PROP_NAME
        })
      )
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@api', resolve('src/api'))
  },
  // i18n
  pluginOptions: {
    i18n: {
      locale: 'zh-chs',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
