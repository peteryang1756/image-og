# image-og

Cloudflare Worker that returns polished Open Graph images for blog posts using `@vercel/og`.

## Usage

- Endpoint: `/api/<subject>?time=YYYY-MM-DD`
- Example: `/api/subject:Cloudflare OG demo?time=2024-04-18`
- Query fallback: `/api?subject=My Article&time=2024-04-18`

## Development

```sh
npm install
npm run dev
```

## Deploy

```sh
npm run deploy
```
