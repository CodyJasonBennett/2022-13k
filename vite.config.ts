import { defineConfig } from 'vite'
import { Packer, InputType, InputAction } from 'roadroller'

const mangleMap: Record<string, string> = {
  projectionMatrix: 'uPM',
  modelViewMatrix: 'uMVM',
}

export default defineConfig({
  build: {
    target: 'esnext',
    polyfillModulePreload: false,
    minify: 'terser',
    terserOptions: {
      module: true,
      toplevel: true,
      compress: {
        ecma: 2020,
        module: true,
        passes: 3,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
      },
      mangle: {
        module: true,
        toplevel: true,
        properties: {
          reserved: Object.keys(mangleMap),
        },
      },
    },
  },
  plugins: [
    {
      name: 'vite-roadroller',
      transformIndexHtml: {
        enforce: 'post',
        async transform(html, ctx) {
          if (!ctx.chunk) return html

          for (const key in ctx.bundle) delete ctx.bundle[key]

          const css = (html.match(/\<style\>[^\<]+\<\/style\>/)?.[0] ?? '')
            .replace(/\n|\s+/g, '')
            .replace(/;\w*\}/g, '}')

          let js = ctx.chunk.code.trim()
          for (const key in mangleMap) js = js.replaceAll(key, mangleMap[key])

          const packer = new Packer(
            [
              {
                data: `document.write('<body>${css}</body>');${js}`,
                type: 'js' as InputType,
                action: 'eval' as InputAction,
              },
            ],
            {},
          )
          await packer.optimize(2)
          const { firstLine, secondLine } = packer.makeDecoder()
          return `<script>${firstLine}\n${secondLine}</script>`
        },
      },
    },
  ],
})
