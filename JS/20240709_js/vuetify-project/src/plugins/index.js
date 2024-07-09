/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'
import VuetifyUseDialog from 'vuetify-use-dialog'

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(VuetifyUseDialog, {
      snackbar: {
        showCloseButton: false, // 不要關閉按鈕
        snackbarProps: {
          timeout: 2000 // 兩秒鐘後自己不見
        }
      }
    })
    .use(router)
    .use(pinia)
}
