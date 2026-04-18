# Astro OG Images on Cloudflare Workers

This project demonstrates generating dynamic Open Graph images for each blog post using [`workers-og`](https://www.npmjs.com/package/workers-og) on Cloudflare Workers. Blog content lives in Astro content collections and the OG endpoint renders `/blog/<slug>/og.png` on demand with custom typography and layout.

## What’s included
- Astro blog starter upgraded for SSR/hybrid output with the Cloudflare adapter
- Raw font loader for Inter TTF files so fonts can be embedded in OG images
- Dynamic OG endpoint at `src/pages/blog/[slug]/og.png.ts`
- Node compatibility for the Cloudflare Worker runtime (`wrangler.toml`)

## Getting started
```sh
npm install
npm run dev
```

- View a blog post at `http://localhost:4321/blog/first-post`
- View its OG image at `http://localhost:4321/blog/first-post/og.png`

## Build & deploy
```sh
npm run build
# then use wrangler to deploy the worker output in dist/_worker.js
wrangler deploy
```

The supplied `wrangler.toml` enables `nodejs_compat` and points to the built worker bundle. Update `compatibility_date` as needed.

## Customizing OG images
- Edit `src/pages/blog/[slug]/og.png.ts` to adjust layout, colors, or fonts.
- Inter fonts are stored in `src/assets/fonts` and loaded via the raw font Vite plugin in `astro.config.mjs`.
- Base metadata for each page (including the OG image URL) is set in `src/components/BaseHead.astro`.
