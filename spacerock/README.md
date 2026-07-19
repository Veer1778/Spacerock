# SPACEROCK — spacerock.club

Stories from the edge of the universe. React (Vite) frontend + Node (Express) backend, built from the Figma "MacBook Air - 1" homepage design.

## Run it

```bash
npm install        # installs server + client deps (postinstall handles client)
npm run dev        # Express on :5000 + Vite on :5173 (with /api proxy)
```

Open http://localhost:5173

## Production

```bash
npm run build      # builds client → client/dist
npm start          # Express serves API + the built site on :5000
```

## Structure

```
spacerock/
├── server/
│   ├── index.js        # Express: /api/home, /api/articles, /api/newsletter
│   └── data.js         # Content store — swap for WordPress REST / CMS later
└── client/
    ├── index.html      # Syne, Funnel Display, Atkinson Hyperlegible Mono
    ├── public/images/  # Drop article images here (filenames in data.js)
    └── src/
        ├── styles/index.css      # Full design system (tokens at the top)
        ├── App.jsx               # Fetches /api/home, topic filtering
        └── components/
            ├── Header.jsx        # Gradient wordmark + rule
            ├── Hero.jsx          # Headline + topic pill filters
            ├── NewsGrid.jsx      # 3-column editorial grid
            ├── Thumb.jsx         # Image w/ branded placeholder fallback
            ├── Newsletter.jsx    # Gradient panel → POST /api/newsletter
            ├── ThisJustIn.jsx    # Tilted polaroid cards + stripes
            ├── FactStation.jsx   # Terminal-window fact cards
            └── Footer.jsx
```

## Images

The design references exported Figma images. Drop them into `client/public/images/`
using the filenames in `server/data.js` (e.g. `claude-mythos.jpg`, `large.jpg`,
`tidbit-opus.jpg`). Until then, every slot renders a branded purple-gradient
placeholder so the layout never breaks.

## WordPress (live content)

The server now has a WordPress adapter (`server/wordpress.js`). Point it at
your site and restart:

```powershell
$env:WP_API_URL = "https://spacerock.club/wp-json/wp/v2"
npm run dev
```

(macOS/Linux: `WP_API_URL=https://spacerock.club/wp-json/wp/v2 npm run dev`)

What it pulls:
- **Articles** — latest 8 posts via `/posts?per_page=8&_embed=1` (title,
  excerpt, featured image, categories/tags). They fill the homepage slots in
  order: lead, column, side, column, column, feature, column, feature-right.
- **Topics** — top categories via `/categories` (skips Uncategorized).
- **Tidbits / Facts** — tries the custom post type routes `/tidbits` and
  `/facts`. If you register those CPTs in WordPress with
  `show_in_rest => true`, they go live automatically; otherwise the local
  fallbacks render.

Responses are cached for 5 minutes. If WordPress is unreachable, the site
falls back to `server/data.js` instead of breaking.

## Newsletter

`POST /api/newsletter { email }` — validates and appends to
`server/subscribers.json`. Swap for Mailchimp/Buttondown/Listmonk when ready.
