<template>
  <div class="oc-keepass oc-width-1-1 oc-height-1-1">
    <h1>henlo2</h1>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue'
import { Resource } from '@opencloud-eu/web-client'
import { AppConfigObject, useMessages, useThemeStore } from '@opencloud-eu/web-pkg'
import { useGettext } from 'vue3-gettext'
import * as kdbxweb from 'kdbxweb'
// import wasmPath from 'argon2-browser/dist/argon2.wasm?url'

// import { setupKdbxwebArgon2 } from './argon2'

// import { setupKdbxwebArgon2WithWorker } from './argon2-worker-client'

// import Argon2, { Argon2Type, Argon2Version } from '@phi-ag/argon2'
// import argon2Browser, { Argon2Type, Argon2Version } from 'argon2-browser/dist/argon2-bundled.min.js'
// // @ts-expect-error
// import wasm from '@phi-ag/argon2/argon2.wasm?url'
// import { dirname } from '@opencloud-eu/web-pkg'

// async function argon2(
//   password: ArrayBuffer,
//   salt: ArrayBuffer,
//   memory: number,
//   iterations: number,
//   length: number,
//   parallelism: number,
//   type: Argon2Type,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   version: Argon2Version // maybe I missed a thing here, because it ain't used in argon2-browser?
// ) {
//   return argon2Browser
//     .hash({
//       // required
//       pass: Buffer.from(new Uint8Array(password)),
//       salt: Buffer.from(new Uint8Array(salt)),
//       // optional
//       time: iterations, // the number of iterations
//       mem: memory, // used memory, in KiB
//       hashLen: length, // desired hash length
//       parallelism: parallelism, // desired parallelism (it won't be computed in parallel, however)
//       //secret: new Uint8Array([...]), // optional secret data - not sure of how to use this?
//       //ad: new Uint8Array([...]), // optional associated data - not sure of how to use this?
//       type: type // Argon2d, Argon2i, Argon2id
//     })
//     .then((res: { hash: Uint8Array; hashHex: string; encoded: string }) => {
//       //res.hash; // hash as Uint8Array
//       //res.hashHex; // hash as hex-string
//       //res.encoded; // encoded hash, as required by argon2
//       return res.hash
//     })
//     .catch((err: { message: string; code: number }) => {
//       //err.message; // error message as string, if available
//       //err.code; // numeric error code
//       throw err
//     })
// }

// kdbxweb.CryptoEngine.setArgon2Impl(argon2)

export default defineComponent({
  props: {
    applicationConfig: { type: Object as PropType<AppConfigObject>, required: true },
    currentContent: {
      type: ArrayBuffer,
      required: true
    },
    isReadOnly: { type: Boolean, required: false },
    resource: { type: Object as PropType<Resource>, required: true }
  },
  setup: (props) => {
    const editorRef = ref<HTMLDivElement>()
    const { $gettext } = useGettext()
    const { showErrorMessage } = useMessages()
    const themeStore = useThemeStore()
    const darkTheme = computed(() => {
      return themeStore.currentTheme.isDark
    })

    watch(
      () => props.currentContent,
      async () => {
        console.log('Current content changed, reloading Keepass database', props.currentContent)
        try {
          const credentials = new kdbxweb.Credentials(
            kdbxweb.ProtectedValue.fromString('foobar'),
            undefined,
            undefined
          )
          const startTime = performance.now()
          console.log('credentials', credentials, startTime)
          const db1 = await kdbxweb.Kdbx.load(props.currentContent, credentials)
          console.log(
            `db1 loaded: ${performance.now() - startTime}ms`,
            performance.now() - startTime,
            db1
          )
          for (const entryOrGroup of db1.getDefaultGroup().allGroupsAndEntries()) {
            console.log('entryOrGroup', entryOrGroup)
          }
          console.log('yay?!')
          // console.log('OK', db1)
          // ;(window as any).db = db1
        } catch (error) {
          console.error('Failed to load Keepass database', error)
          showErrorMessage($gettext('Failed to load Keepass database'), error)
        }
      },
      {
        immediate: true
      }
    )
    return {
      editorRef,
      darkTheme
    }
  }
})
</script>
<style lang="scss">
// .jse {
//   &-menu {
//     background-color: var(--oc-role-chrome) !important;
//   }
//
//   &-error {
//     display: none !important; // Hide, as we show our own error via showErrorMessage to keep it simple
//   }
//
//   &-menu {
//     button:nth-of-type(1) {
//       border-bottom-left-radius: 8px !important;
//       border-top-left-radius: 8px !important;
//     }
//
//     button:nth-of-type(3) {
//       border-bottom-right-radius: 8px !important;
//       border-top-right-radius: 8px !important;
//     }
//   }
// }
</style>
