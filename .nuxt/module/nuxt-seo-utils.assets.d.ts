// Generated by nuxt-seo-utils.assets

declare module '#app' {
  import { HeadEntry, HeadTag } from '@unhead/schema'

  interface RuntimeNuxtHooks {
    'head:tags': (tag: HeadTag[]) => Promise<void> | void
    'head:entries': (entries: HeadEntry[]) => Promise<void> | void
  }
}
declare module '@unhead/schema' {

  type PublicFiles = '/_robots.txt' | '/favicon.ico' | '/images/IDLOGO.png' | '/images/computer.png' | '/images/corelogic.webp' | '/images/fat8.jpg' | '/images/g2.png' | '/images/madg.png' | '/images/mdcc.webp' | '/images/me_1.png' | '/images/me_3.png' | '/images/olemiss.png' | '/images/thompson.png' | '/images/tools.png' | (string & Record<never, never>)
  type JsFiles = (string & Record<never, never>)

  interface SchemaAugmentations {
    link: import('@unhead/schema').UserTagConfigWithoutInnerContent & {
      href: PublicFiles
    }
    script: import('@unhead/schema').TagUserProperties & {
      src: JsFiles
    }
  }
}
export {}
