# NEXUS: Discover. Participate. Create.

College club event platform. React + Vite + Tailwind (Vercel) · Express + Mongoose + JWT (Render) · MongoDB Atlas.

```
nexus/
├── client/   React app (vercel.json = SPA rewrites, .env.example)
├── server/   Express API (src/app.js, routes/, models.js, seedData.js)
├── render.yaml   Render blueprint
└── .env.example  Backend variables (client has its own)
```

## Run locally
```bash
npm run install:all
cp server/.env.example server/.env     # set MONGODB_URI (Atlas or local), JWT_SECRET, NODE_ENV=development
npm run seed                           # demo events, registrations, admin user
npm run dev:server                     # http://localhost:5000/api/health
npm run dev:client                     # http://localhost:5173 (Vite proxies /api, leave VITE_API_URL empty)
```
**Demo admin:** `admin@nexus.edu` / `Admin@12345` at `/admin/login` (change `ADMIN_PASSWORD` before going public).

## API
| Method | Route | Access |
|---|---|---|
| GET | /api/health | public |
| POST | /api/auth/login | public |
| GET / POST | /api/events | public / admin |
| GET / PUT / DELETE | /api/events/:id | public / admin / admin |
| POST | /api/registrations | public |
| GET | /api/registrations (`?q=&event=`) | admin |
| GET / DELETE | /api/registrations/:id | admin |

Admin routes need `Authorization: Bearer <token>`.

## Deploy

### 1. MongoDB Atlas
1. Create a free M0 cluster, then **Database Access** → add a user with a password (avoid special characters or URL-encode them).
2. **Network Access** → add `0.0.0.0/0` (Render free tier has no fixed IPs).
3. **Connect → Drivers** → copy the URI and add the database name: `mongodb+srv://USER:PASS@cluster.mongodb.net/nexus?retryWrites=true&w=majority`.

### 2. Backend on Render
1. Push this repo to GitHub. **New → Web Service** (or **New → Blueprint** to use `render.yaml`).
2. Root Directory `server` · Build `npm install` · Start `npm start` · Health check path `/api/health`.
3. Environment variables: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET` (long random), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SEED_DEMO_DATA=true`, and `CLIENT_URL` (set after step 3; first deploy can use a placeholder).
4. Deploy, then open `https://<service>.onrender.com/api/health`. Expect `{"status":"ok","db":"connected"}`. The admin user and demo data are created automatically on first boot.

### 3. Frontend on Vercel
1. **Add New → Project**, import the repo, set **Root Directory** to `client` (Framework: Vite, build `npm run build`, output `dist`).
2. Environment variable: `VITE_API_URL=https://<service>.onrender.com` (no trailing slash, no `/api`).
3. Deploy. `client/vercel.json` rewrites every path to `index.html`, so refreshing `/events/123` or `/admin` works.

### 4. Connect them (CORS)
Back in Render, set `CLIENT_URL=https://<your-app>.vercel.app` (comma-separate extra domains, no trailing slash) and redeploy. Vite variables are baked in at build time, so redeploy Vercel after changing `VITE_API_URL`.

### Checklist
- `/api/health` shows `db: connected`
- Home page lists events (proves frontend → API → MongoDB)
- `/admin/login` works with the demo credentials; register for an event and see it in Admin → Registrations
- Set `SEED_DEMO_DATA=false` once you have real data

Notes: Render's free tier sleeps after inactivity, so the first request can take ~30 s (the UI shows a hint). Preview deployments on Vercel have different URLs; add them to `CLIENT_URL` if you need them.
