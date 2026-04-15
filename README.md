# gavesh.live

Personal portfolio + live dashboard thing.
Built with **Svelte 5**.

## What this is

- A personal site (`/`, `/projects`, `/skills`, `/music`, `/links`)
- Last.fm-powered music endpoints
- Styled to be minimal, dark, and slightly dramatic

## Stack

- SvelteKit 2 + Svelte 5
- Tailwind CSS
- Vite
- Vercel Analytics

## Run locally

```bash
npm install
npm run dev
```

## Environment variables

For music API routes, set:

- `LASTFM_API_KEY`
- `LASTFM_API_USERNAME`

If these are missing, music endpoints will fail loudly (as they should).

## Disclaimer

Not a starter template.
