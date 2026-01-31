# AutoOps AI Frontend

React + Vite single-page app that showcases the AutoOps AI command center. It covers the full judge-facing flow: Dashboard -> Messages -> Actions -> Action approval.

## Stack

- React 19 (Vite) with React Router 7
- Material UI 7 + custom dark theme
- Axios API layer (`src/services/api.js`)
- Shared hooks (`src/hooks/useFetch.js`) and sample data fallbacks in `src/utils/constants.js`

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

The dev server expects the orchestration backend at `http://localhost:8080`. Override via `.env`:

```
VITE_API_BASE_URL=https://my-backend.example.com
```

## API Contract

All HTTP traffic is centralized in `src/services/api.js`. The app calls:

- `GET /api/messages`
- `POST /api/messages`
- `GET /api/actions`
- `GET /api/actions/:id`
- `POST /api/actions/:id/approve`

If any endpoint fails, the UI falls back to curated demo data and shows a warning banner so you can still run the product demo offline.

## Feature Checklist

- Dashboard: KPI stat cards, risk spotlight, pending action queue
- Messages: ingest form, sentiment badges, live list
- Actions: status filters, CTA to view detail
- Action Detail: AI explanation, editable draft, approval flow with optimistic refresh
- Global layout: Navbar with route pills, sticky sidebar, loaders, empty states, theming

## Scripts

| Command        | Description                         |
|----------------|-------------------------------------|
| `npm run dev`  | Start Vite dev server                |
| `npm run build`| Production build                     |
| `npm run preview` | Preview the production build     |
| `npm run lint` | ESLint (JS/JSX)                      |

## Demo Flow Tips

1. Open `Dashboard` to frame the narrative (signals -> actions).
2. Jump into `Messages` to ingest a new note and highlight sentiment badges.
3. Move into `Actions` to show queued automations.
4. Finish inside `Action Detail` by editing the draft and pressing **Approve & execute**.

Everything is pre-wired so you can narrate the story in under three minutes.
