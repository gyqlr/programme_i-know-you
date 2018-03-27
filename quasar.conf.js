// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      'axios',
      'apollo',
      'bmob'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: true,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'hash',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack(cfg) {}
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true, // opens browser window automatically
      proxy: {
        // proxy all requests starting with /api to jsonplaceholder
        '/api': {
          target: 'http://localhost:9999',
          changeOrigin: true,
        },
        '/bmob': {
          target: 'https://api.bmob.cn/',
          changeOrigin: true,
          pathRewrite: {
            '^/bmob': ''
          }
        }
      }
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      i18n: 'zh-hans',
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QTabs',
        'QRouteTab',
        'QCard',
        'QCardTitle',
        'QCardMain',
        'QCardActions',
        "QField",
        "QInput",
        "QDatetime",
        "QModal",
        'QCheckbox',
        'QRadio',
        'QOptionGroup',
        'QSelect',
        'QToggle',
        'QChipsInput',
        'QPopover',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSeparator',
        'QItemSide',
        'QItemTile',
        'QRating',
        'QInnerLoading',
        'QSpinnerGears',
        'QKnob',
        'QStepper',
        'QStep',
        'QStepperNavigation'
      ],
      directives: [
        'Ripple'
      ],
      plugins: [
        'Notify',
        'Loading',
        'Dialog',
        'AppFullscreen',
        // 'Cookies'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
      'fadeInDown',
      'fadeInUp',
      'fadeIn'
    ],
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        name: "未命名 - 智能问卷系统",
        short_name: "Untitled",
        description: "给你想要的结果",
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#51b882',
        icons: [{
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon - 192*192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon - 256*256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon - 384*384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon - 512*512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.app'
    },
    electron: {
      extendWebpack(cfg) {
        // do something with cfg
      },
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    },

    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
