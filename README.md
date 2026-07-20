# idrewlong.com

Source for [idrewlong.com](https://www.idrewlong.com), Andrew Long's portfolio site — built with Nuxt 3, Vue 3, and Tailwind CSS.

## Stack

- [Nuxt 3](https://nuxt.com) / Vue 3
- Tailwind CSS
- [@nuxt/fonts](https://fonts.nuxt.com), [@nuxt/icon](https://github.com/nuxt/icon), [@nuxt/image](https://image.nuxt.com)
- [@nuxtjs/seo](https://nuxtseo.com) (meta tags, sitemap, robots.txt)
- GSAP for animation
- Web3Forms for the contact form ([server/api/contact.post.ts](server/api/contact.post.ts))

## Setup

Requires an `ACCESS_KEY` environment variable — a [Web3Forms](https://web3forms.com) access key used by the contact form endpoint. Copy `.env.example` to `.env` and fill it in:

```bash
cp .env.example .env
```

Install dependencies:

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on `http://localhost:3000`.

## Production

```bash
npm run build
npm run preview # preview the production build locally
```
