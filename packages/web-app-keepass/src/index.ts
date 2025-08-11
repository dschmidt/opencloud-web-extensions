import { AppWrapperRoute, defineWebApplication } from '@opencloud-eu/web-pkg'
import { useGettext } from 'vue3-gettext'
import App from './App.vue'
import translations from '../l10n/translations.json'
// @ts-ignore
// import * as kdbxweb from 'kdbxweb'
// import { argon2 } from './argon2'

// kdbxweb.CryptoEngine.setArgon2Impl((...args) => argon2(...args))

// setup argon2 worker
import { KdbxwebInit } from './kdbx-init'
KdbxwebInit.init()

const applicationId = 'keepass'
export default defineWebApplication({
  setup() {
    const { $gettext } = useGettext()

    ;(async () => {})()

    const routes = [
      {
        name: applicationId,
        path: '/:driveAliasAndItem(.*)?',
        component: AppWrapperRoute(App, {
          applicationId,
          fileContentOptions: {
            responseType: 'arraybuffer'
          }
        }),
        meta: {
          authContext: 'hybrid',
          title: $gettext('Keepass'),
          patchCleanPath: true
        }
      }
    ]

    const appInfo = {
      name: $gettext('Keepass'),
      id: applicationId,
      icon: 'lock',
      defaultExtension: 'json',
      extensions: [
        {
          extension: 'kdbx',
          routeName: 'keepass'
        }
      ]
    }

    return {
      appInfo,
      routes,
      translations
    }
  }
})
