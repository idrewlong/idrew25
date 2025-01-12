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
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module`
     */
    ["site"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module`
     */
    ["robots"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module`
     */
    ["sitemap"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module`
     */
    ["ogImage"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module`
     */
    ["schemaOrg"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module`
     */
    ["linkChecker"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module`
     */
    ["seo"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/seo`
     */
    ["nuxtseo"]: typeof import("@nuxtjs/seo").default extends NuxtModule<infer O> ? O : Record<string, any>
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
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module`
     */
    ["site"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module`
     */
    ["robots"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module`
     */
    ["sitemap"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module`
     */
    ["ogImage"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module`
     */
    ["schemaOrg"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module`
     */
    ["linkChecker"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module`
     */
    ["seo"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/seo`
     */
    ["nuxtseo"]?: typeof import("@nuxtjs/seo").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/image", Exclude<NuxtConfig["image"], boolean>] | ["nuxt-gtag", Exclude<NuxtConfig["gtag"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module", Exclude<NuxtConfig["site"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module", Exclude<NuxtConfig["robots"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module", Exclude<NuxtConfig["sitemap"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module", Exclude<NuxtConfig["ogImage"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module", Exclude<NuxtConfig["schemaOrg"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module", Exclude<NuxtConfig["linkChecker"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module", Exclude<NuxtConfig["seo"], boolean>] | ["@nuxtjs/seo", Exclude<NuxtConfig["nuxtseo"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
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
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module
     */
    ["site"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module
     */
    ["robots"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module
     */
    ["sitemap"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module
     */
    ["ogImage"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module
     */
    ["schemaOrg"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module
     */
    ["linkChecker"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module
     */
    ["seo"]: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module").default extends NuxtModule<infer O> ? O : Record<string, any>
    /**
     * Configuration for `@nuxtjs/seo`
     * @see https://www.npmjs.com/package/@nuxtjs/seo
     */
    ["nuxtseo"]: typeof import("@nuxtjs/seo").default extends NuxtModule<infer O> ? O : Record<string, any>
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
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module
     */
    ["site"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module
     */
    ["robots"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module
     */
    ["sitemap"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module
     */
    ["ogImage"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module
     */
    ["schemaOrg"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module
     */
    ["linkChecker"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module`
     * @see https://www.npmjs.com/package//Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module
     */
    ["seo"]?: typeof import("/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxtjs/seo`
     * @see https://www.npmjs.com/package/@nuxtjs/seo
     */
    ["nuxtseo"]?: typeof import("@nuxtjs/seo").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    /**
     * Configuration for `@nuxt/telemetry`
     * @see https://www.npmjs.com/package/@nuxt/telemetry
     */
    ["telemetry"]?: typeof import("@nuxt/telemetry").default extends NuxtModule<infer O> ? Partial<O> : Record<string, any>
    modules?: (undefined | null | false | NuxtModule<any> | string | [NuxtModule | string, Record<string, any>] | ["@nuxt/fonts", Exclude<NuxtConfig["fonts"], boolean>] | ["@nuxt/icon", Exclude<NuxtConfig["icon"], boolean>] | ["@nuxt/image", Exclude<NuxtConfig["image"], boolean>] | ["nuxt-gtag", Exclude<NuxtConfig["gtag"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-site-config/dist/module", Exclude<NuxtConfig["site"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/robots/dist/module", Exclude<NuxtConfig["robots"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/@nuxtjs/sitemap/dist/module", Exclude<NuxtConfig["sitemap"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-og-image/dist/module", Exclude<NuxtConfig["ogImage"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-schema-org/dist/module", Exclude<NuxtConfig["schemaOrg"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-link-checker/dist/module", Exclude<NuxtConfig["linkChecker"], boolean>] | ["/Users/idrew/Desktop/git_repo/personal/idrew25/node_modules/nuxt-seo-utils/dist/module", Exclude<NuxtConfig["seo"], boolean>] | ["@nuxtjs/seo", Exclude<NuxtConfig["nuxtseo"], boolean>] | ["@nuxt/telemetry", Exclude<NuxtConfig["telemetry"], boolean>])[],
  }
  interface RuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   ACCESS_KEY: string,

   nitro: {
      envPrefix: string,
   },

   icon: {
      serverKnownCssClasses: Array<any>,
   },

   sitemap: {
      isI18nMapped: boolean,

      sitemapName: string,

      isMultiSitemap: boolean,

      excludeAppSources: Array<any>,

      cacheMaxAgeSeconds: number,

      autoLastmod: boolean,

      defaultSitemapsChunkSize: number,

      minify: boolean,

      sortEntries: boolean,

      debug: boolean,

      discoverImages: boolean,

      discoverVideos: boolean,

      sitemapsPathPrefix: string,

      isNuxtContentDocumentDriven: boolean,

      xsl: string,

      xslTips: boolean,

      xslColumns: Array<{

      }>,

      credits: boolean,

      version: string,

      sitemaps: {
         "sitemap.xml": {
            sitemapName: string,

            route: string,

            defaults: any,

            include: Array<any>,

            exclude: Array<string>,

            includeAppSources: boolean,
         },
      },
   },

   "nuxt-site-config": {
      stack: Array<{

      }>,

      version: string,

      debug: boolean,
   },

   "nuxt-robots": {
      version: string,

      usingNuxtContent: boolean,

      debug: boolean,

      credits: boolean,

      groups: Array<{

      }>,

      sitemap: Array<string>,

      header: boolean,

      robotsEnabledValue: string,

      robotsDisabledValue: string,

      cacheControl: string,
   },

   "nuxt-og-image": {
      version: string,

      satoriOptions: any,

      resvgOptions: any,

      sharpOptions: any,

      publicStoragePath: string,

      defaults: {
         emojis: string,

         renderer: string,

         component: string,

         extension: string,

         width: number,

         height: number,

         cacheMaxAgeSeconds: number,
      },

      debug: boolean,

      baseCacheKey: string,

      fonts: Array<{

      }>,

      hasNuxtIcon: boolean,

      colorPreference: string,

      hasNuxtContent: boolean,

      strictNuxtContentPaths: any,

      isNuxtContentDocumentDriven: boolean,
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

   "nuxt-schema-org": {
      reactive: boolean,

      minify: boolean,

      scriptAttributes: {
         "data-nuxt-schema-org": boolean,
      },

      identity: any,

      version: string,
   },

   "seo-utils": {
      canonicalQueryWhitelist: Array<string>,
   },
  }
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: RuntimeConfig
        }
      }