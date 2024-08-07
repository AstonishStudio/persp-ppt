/* eslint-disable @typescript-eslint/no-var-requires */

const StyleLintPlugin = require('stylelint-webpack-plugin')
module.exports = {
  publicPath: './',
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '~@/assets/styles/variable.scss';
          @import '~@/assets/styles/mixin.scss';
        `,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new StyleLintPlugin({
        files: ['src/**/*.{vue,html,css,scss}'],
        failOnError: false,
        cache: false,
        fix: false,
      }),
    ],
  },
  pwa: {
    name: 'PPTist',
    themeColor: '#d14424',
    iconPaths: {
      faviconSVG: null,
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon-152x152.png',
      maskIcon: null,
      msTileImage: null,
    },
    manifestOptions: {
      name: 'PPTist',
      short_name: 'PPTist',
      theme_color: '#d14424',
      icons: [{
        src: 'icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: 'icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }, {
        src: 'icons/android-chrome-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      }, {
        src: 'icons/android-chrome-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }],
      start_url: '.',
      display: 'standalone',
      background_color: '#000000',
    },
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'PPTist',
          expiration: {
            maxAgeSeconds: 60 * 60 * 10,
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }],
      include: [
        /\.ttf$/,
      ],
      skipWaiting: true,
    }
  },
   devServer: {
    proxy: {
       "/space": {
        target: "http://localhost:8080",
        ws: true, //
         changeOrigin: true,
         pathRewrite: {
          '^/space': '/space',
        },
       },
       "/dicom": {
        target: "http://localhost:8080",
        ws: true, //
        changeOrigin: true,
         pathRewrite: {
          '^/dicom': '/dicom',
        },
      }
    },
  },
}