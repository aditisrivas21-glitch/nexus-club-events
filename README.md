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
## ⚠️ Known Deployment Issue

### Why do I sometimes need to refresh the page?

The project uses a **React/Vite frontend deployed on Vercel** and an **Express/Node.js backend deployed on Render**. Since these are hosted separately, the frontend communicates with the backend through API requests.

The backend is hosted on Render's **Free plan**, which may temporarily put the server to sleep after a period of inactivity. When the application is opened again, the first API request may take some time while the backend starts up.

Because of this, the application may occasionally show a loading/error state on the first request. Refreshing the page allows the frontend to retry the API request after the backend has become available.

### CORS Issue

The frontend and backend are hosted on different domains:

* **Frontend:** Vercel
* **Backend:** Render

Therefore, the backend must explicitly allow requests coming from the Vercel frontend.

The application uses the `cors` middleware in Express and the `CLIENT_URL` environment variable to allow the deployed frontend origin.

If the deployed frontend URL changes, the backend CORS configuration must also be updated with the new Vercel URL.

The current API health endpoint is:

`https://nexus-club-events.onrender.com/api/health`

A successful response confirms that the backend and MongoDB connection are working.

### Why refreshing currently helps

Refreshing does not actually fix the underlying configuration. It simply causes the React application to make the API request again.

For example:

1. User opens the Vercel application.
2. React loads the page.
3. React requests data from the Render API.
4. If the Render server is waking up or the CORS configuration does not recognize the current Vercel origin, the request can fail.
5. The page displays an error/loading state.
6. Refreshing triggers the request again.
7. Once the backend is awake and the origin is correctly allowed, the data loads successfully.

### Planned / Required Fix

The issue can be permanently addressed by:

1. Keeping the backend `CLIENT_URL` synchronized with the deployed Vercel URL.
2. Configuring Express CORS to allow the production Vercel origin.
3. Ensuring the CORS middleware is loaded before the API routes.
4. Redeploying the Render backend after changing the CORS configuration.
5. Keeping `VITE_API_URL` in the Vercel frontend pointed to:

`https://nexus-club-events.onrender.com`

6. Adding proper frontend loading and error states so that users are informed when the backend is waking up instead of having to manually refresh.

### Current Status

The backend health check is operational:

`GET /api/health`

Response:

```json
{
  "status": "ok",
  "db": "connected"
}
```

This confirms that the Render backend is running and successfully connected to MongoDB.

The remaining issue is the communication between the deployed Vercel frontend and Render API, specifically the **CORS configuration and first-request/cold-start behavior**.

### Future Improvement

For production use, the backend can be moved to a hosting plan that does not sleep during inactivity. This would eliminate the cold-start delay and provide a smoother user experience.
