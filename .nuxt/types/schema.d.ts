import { NuxtModule, RuntimeConfig } from '@nuxt/schema'
declare module '@nuxt/schema' {
  interface NuxtOptions {
    /**
     * Configuration for `@nuxt/fonts`
     */
    ["fonts"]: typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     */
    ["icon"]: typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     */
    ["image"]: typeof import("@nuxt/image").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-gtag`
     */
    ["gtag"]: typeof import("nuxt-gtag").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@nuxt/fonts`
     */
    ["fonts"]?: typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     */
    ["icon"]?: typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     */
    ["image"]?: typeof import("@nuxt/image").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-gtag`
     */
    ["gtag"]?: typeof import("nuxt-gtag").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/image", Exclude<NuxtConfig["image"], boolean>] | ["nuxt-gtag", Exclude<NuxtConfig["gtag"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
}
declare module 'nuxt/schema' {
  interface NuxtOptions {
    /**
     * Configuration for `@nuxt/fonts`
     * @see https://www.npmjs.com/package/@nuxt/fonts
     */
    ["fonts"]: typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     * @see https://www.npmjs.com/package/@nuxt/icon
     */
    ["icon"]: typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     * @see https://www.npmjs.com/package/@nuxt/image
     */
    ["image"]: typeof import("@nuxt/image").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `nuxt-gtag`
     * @see https://www.npmjs.com/package/nuxt-gtag
     */
    ["gtag"]: typeof import("nuxt-gtag").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? O : Record<string, any>
  }
  interface NuxtConfig {
    /**
     * Configuration for `@nuxt/fonts`
     * @see https://www.npmjs.com/package/@nuxt/fonts
     */
    ["fonts"]?: typeof import("@nuxt/fonts").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/icon`
     * @see https://www.npmjs.com/package/@nuxt/icon
     */
    ["icon"]?: typeof import("@nuxt/icon").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/image`
     * @see https://www.npmjs.com/package/@nuxt/image
     */
    ["image"]?: typeof import("@nuxt/image").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `nuxt-gtag`
     * @see https://www.npmjs.com/package/nuxt-gtag
     */
    ["gtag"]?: typeof import("nuxt-gtag").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/image", Exclude<NuxtConfig["image"], boolean>] | ["nuxt-gtag", Exclude<NuxtConfig["gtag"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nitro: {
      envPrefix: string,
   },

   icon: {
      serverKnownCssClasses: Array<any>,
   },
  }
  interface PublicRuntimeConfig {
   gtag: {
      enabled: boolean,

      initMode: string,

      id: string,

      initCommands: Array<any>,

      config: any,

      tags: Array<any>,

      loadingStrategy: string,

      url: string,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }