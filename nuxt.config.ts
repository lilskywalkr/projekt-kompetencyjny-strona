// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,

  proxy: {
    options: [
        {
          target: process.env.NUXT_SALSEFORCE_SERVER_URL,
          changeOrigin: true,
          pathRewrite: {
            '^/api/auth': '/oauth2/token',
            '^/api/login': '/apexrest/Client__c/login',
            '^/api/register': '/apexrest/Client__c/register',
            '^/api/books': '/apexrest/Item__c/getItems',
            '^/api/borrow': '/apexrest/Item__c/borrow',
            '^/api/pdf': '/apexrest/Item__c/getPDF',
            '^/api/info': '/apexrest/Client__c/getClient'
          },
          pathFilter: [
            '/api/auth',
            '/api/login',
            '/api/register',
            '/api/books',
            '/api/borrow',
            '/api/pdf',
            '/api/info',
          ]
        },
    ],
  },
  
  runtimeConfig: {
    clientId: process.env.NUXT_SALSEFORCE_CLIENT_ID,
    clientSecret: process.env.NUXT_SALSEFORCE_CLIENT_SECRET,
  },

  modules: [
    '@pinia/nuxt',
    'nuxt-proxy',
    'nuxt-icon',
  ],

  pinia: {
    autoImports: ['defineStore'],
  },

  imports: {
    dirs: ['./stores'],
  },
})