import { defineConfig } from '@vben/vite-config'

import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      build: {
        cssTarget: 'chrome53',
        target: 'es2015',

        terserOptions: {
          compress: {
            drop_console: true // 移除所有 console
            // 或者更精确控制：
            // pure_funcs: ['console.log'] // 只移除 console.log
          }
        }
      },
      plugins: [
        ElementPlus({
          format: 'esm'
        })
      ],
      server: {
        proxy: {
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: 'http://localhost:5320/api',
            ws: true
          },
          '/nsosDataService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsosDataService/, ''),
            target: 'http://192.168.100.104:8094/nsosDataService'
            // ws: true,
          },

          // 排行榜
          '/nsosfsService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsosfsService/, ''),
            target: 'http://192.168.10.231:8095/nsosfsService'
            // ws: true,
          },
          '/nsosgzService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsosgzService/, ''),
            target: 'http://192.168.10.232:8092/nsosgzService',
            ws: true
          },
          // 数字认证
          '/nsosrzService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsosrzService/, ''),
            target: 'http://192.168.10.232:8088/nsosrzService'
            // ws: true,
          },
          '/nsosSecurityService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsosSecurityService/, ''),
            target: 'http://192.168.10.232:8096/nsosSecurityService'
            // ws: true,
          },
          '/nsostzService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsostzService/, ''),
            target: 'http://172.16.126.98:8091/nsostzService',
            ws: true
          },
          '/nsoszhService': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/nsoszhService/, ''),
            target: 'http://localhost:8093/nsoszhService',
            ws: true
          }
        }
      }
    }
  }
})
