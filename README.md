# Nuvou.food

Online shop for Nuvou's plant-based prepared meals (Portugal, PT/EN).
Next.js + Payload CMS + Postgres (Neon).

**Architecture, conventions and every decision (with its reason) are in [`CLAUDE.md`](CLAUDE.md).**

## Run it locally

1. **Node 24** (pinned in `.nvmrc`). With [fnm](https://github.com/Schniz/fnm): `fnm install 24`, then `fnm use` in this folder.
2. **Secrets:** copy `.env.example` to `.env.local`, then fill in `DATABASE_URL` (Neon) and `PAYLOAD_SECRET`.
3. **Install and start:**
   ```bash
   npm install
   npm run dev
   ```
4. Site: http://localhost:3000 (redirects to `/pt` or `/en`). Admin: http://localhost:3000/admin (create the first admin user on the first visit).

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` / `npm start` | Production build / run it |
| `npm run lint` | ESLint |
| `npm run generate:types` | Regenerates `src/payload-types.ts` after changing collections |
| `npm run generate:importmap` | Regenerates the admin import map after adding admin components |
