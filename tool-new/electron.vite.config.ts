import react from '@vitejs/plugin-react'
import { bytecodePlugin, defineConfig, externalizeDepsPlugin, swcPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin(), swcPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@system': resolve('src/system'),
        '@preload': resolve('src/preload')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin(), swcPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@system': resolve('src/system'),
        '@preload': resolve('src/preload')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@main': resolve('src/main'),
        '@system': resolve('src/system'),
        '@preload': resolve('src/preload')
      }
    },
    plugins: [react()]
  }
})
