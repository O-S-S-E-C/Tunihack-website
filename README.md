# TuniHack 12.0 Website

The official website for TuniHack 12.0, Tunisia's national hackathon on cybersecurity and artificial intelligence, organized by OSSEC at ENSI.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 to view the site.

Create a production build with:

```bash
npm run build
npm run start
```

## Adding A Sponsor

1. Put the sponsor logo in `public/sponsors/`. Use a compact PNG or SVG with a transparent background when possible.
2. Add one entry to `SPONSORS` in `src/data/sponsors.ts`:

```ts
{
	name: "Example Sponsor",
	tier: "gold",
	logo: "/sponsors/example-sponsor.png",
	url: "https://example.com",
	invert: false,
}
```

Available tiers are `platinum`, `gold`, and `partner`. The graph calculates the sponsor position and connections automatically. `logo`, `url`, and `invert` are optional; when no logo is available, the graph displays the sponsor initials.

After adding a sponsor, run `npm run build` to check the data and layout compile correctly.
