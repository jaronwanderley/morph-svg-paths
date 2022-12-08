import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'terser',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MorphSVGPaths',
      fileName: 'morph-svg-paths',
      formats: ['es', 'umd', 'iife'],
    },
    rollupOptions: {
      plugins: [
        {
          name: 'remove-collection-handlers',
          transform(code, id) {
            if (id.endsWith('reactivity.esm-bundler.js')) {
              return code
                .replace('mutableCollectionHandlers,', 'null,')
                .replace('readonlyCollectionHandlers,', 'null,')
            }
          },
        },
      ],
    },
  },
  test: {
    coverage: {
      reporter: ['text', 'html', 'json-summary'],
      reportsDirectory: './docs/test',
    },
  },
  plugins: [dts()],
})
