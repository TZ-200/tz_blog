// Nextjsでnode_modulesからCSSをロードできるようにする

const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  cssLoaderOptions: {
    url: false
  }
})

