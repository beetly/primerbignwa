# Copilot Instructions for PRIMER BINGWA

## Project Overview
- PRIMER BINGWA is a Node.js/Express web app for buying airtime and internet bundles, integrating with M-Pesa (Safaricom) via STK Push.
- The frontend is static (HTML/CSS/JS in `PUBLIC/`), styled with Tailwind CSS and FontAwesome, and dynamically renders packages from localStorage.
- The backend (`server.js`) exposes an `/stkpush` API for payment, handling Safaricom OAuth and STK Push requests using environment variables.

## Key Files & Structure
- `server.js`: Express server, M-Pesa integration, main API logic.
- `PUBLIC/scrpt.js`: Frontend logic for package selection, payment modal, and form submission.
- `PUBLIC/index.html`: Main UI, includes Tailwind, FontAwesome, and custom scripts.
- `images/`: Static assets.
- `.env` (not checked in): Required for API keys and secrets.

## Developer Workflows
- **Start server:** `node server.js` (ensure `.env` is present with required keys)
- **Frontend dev:** Edit files in `PUBLIC/`, refresh browser to see changes.
- **Payment test:** Use Safaricom sandbox credentials for development; real payments require production keys.
- **No build step:** Static frontend, no bundler or transpiler.
- **No formal tests:** Manual testing via browser and API calls.

## Patterns & Conventions
- **Packages**: Managed in frontend via localStorage; admin panel allows adding new packages (not persisted server-side).
- **API Integration**: Frontend currently posts directly to Safaricom sandbox; production should use `/stkpush` endpoint on backend.
- **Environment Variables**: Backend expects `CONSUMER_KEY`, `CONSUMER_SECRET`, `BUSINESS_SHORTCODE`, `PASSKEY`, `CALLBACK_URL`, `PORT` in `.env`.
- **Error Handling**: API errors logged to console, minimal user feedback.
- **Styling**: Tailwind classes in HTML, custom styles in `style.css`.

## External Dependencies
- Node.js, Express, Axios, CORS, dotenv (see `package.json`)
- Tailwind CSS, FontAwesome (CDN in HTML)
- Safaricom M-Pesa API (sandbox for dev)

## Integration Points
- **Frontend/Backend**: Intended to POST payment requests to backend `/stkpush`, but current frontend posts directly to Safaricom for demo.
- **Admin Panel**: UI for adding packages, but only updates localStorage (no backend persistence).

## Examples
- To add a new bundle, update the `packages` array in `scrpt.js` or use the admin panel.
- To test payment, select a package and submit phone number; check browser console and backend logs for errors.

## Recommendations for AI Agents
- Always check `.env` for required keys before running backend.
- Use Safaricom sandbox endpoints for development and testing.
- When updating payment logic, ensure frontend posts to backend `/stkpush` (not directly to Safaricom) for production.
- Document any new developer workflow or integration in this file for future agents.
