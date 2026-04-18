# Pi Controller Website

Node.js + Socket.IO web service to control a Raspberry Pi relay (door opener style), with user authentication, registration, request throttling, and optional email notifications.

## Features

- Relay control via realtime Socket.IO events
- Fallback HTTP endpoint for relay trigger (`POST /api/relay`)
- User registration and login backed by MongoDB
- PBKDF2 password hashing (salt + hash)
- Basic anti-bruteforce throttling per IP
- Optional Gmail OAuth2 email notifications
- Handlebars + Materialize frontend

## Tech Stack

- Node.js + Express
- Socket.IO
- MongoDB + Mongoose
- Handlebars (`hbs` + `express-handlebars`)
- Winston logging
- Nodemailer + Google OAuth2
- `onoff` for GPIO access on Raspberry Pi

## Project Structure

```
app.js
config/
database/
  db.js
  Request.js
  User.js
public/
  css/
  images/
  js/controller.js
routes/
  api.js
  controller.js
ServerFunctions/
  HandleAuthentification.js
  HandleEMail.js
  HandleGPIO.js
  HandleIO.js
  HandleSession.js
  Logger.js
views/
  controller.hbs
  layouts/main.hbs
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB (required for auth, registration, request tracking)
- Raspberry Pi with GPIO access (optional for real relay control)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment config file:

```bash
mkdir -p config
cp config/config.env config/config.env.local 2>/dev/null || true
```

If `config/config.env` does not exist yet, create it and fill values shown below.

## Environment Variables

Create `config/config.env`:

```dotenv
# Runtime
NODE_ENV=developement
HTTP_PORT=3001
HTTP_DEV_PORT=3001

# GPIO
RELAY_PIN=17
RELAY_ON_TIME=3000

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/pi-controller

# Email (optional)
CLIENT_ID=
CLIENT_SECRET=
EMAIL_REDIRECT_URI=
REFRESH_TOKEN=
EMAIL_USER=
EMAIL_RECEIVERS=admin@example.com;second@example.com
```

Notes:

- This project checks `NODE_ENV` against the string `developement` (spelling in code), so use `developement` for local development mode.
- If `MONGO_URI` is missing, DB features are disabled and authentication/registration will not work correctly.
- If email variables are missing, email sending is automatically disabled.

## Run

Development (auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

Default port is `3001` unless overridden by env vars.

## Usage

Open the controller UI:

- `http://localhost:3001/`

Main flows:

- **Relay trigger (Socket.IO):** user enters name + password and submits relay form
- **Registration (Socket.IO):** user submits registration form for manual approval
- **Relay trigger (HTTP):** `POST /api/relay` with JSON body `{ username, password }`

## API

### `POST /api/relay`

Authenticate user and activate relay for `RELAY_ON_TIME` milliseconds.

Request body:

```json
{
  "username": "your-user",
  "password": "your-password"
}
```

Responses:

- `200` relay activated
- `400` bad request or too frequent requests
- `401` invalid credentials
- `500` internal error

### `GET /api/relay`

Returns a helper string telling you to use POST.

## Socket.IO Events

Client emits:

- `relay authentification` with `{ username, password }`
- `register form` with `{ username, email, password1, password2 }`

Server emits:

- `relay-event-response` (HTML-formatted status text)
- `registration-event-response` (HTML-formatted status text)
- `relay_state-update` (`true`/`false`)

## Data Models

### User

- `username` (required)
- `email` (required)
- `hash`
- `salt`
- `activated` (default `false`)

### Request

- `ip` (required)
- `date` (required)
- `triesLeft` (default `2`)
- `notifiedAdmin` (default `false`)

## Security Notes

- Passwords are hashed with PBKDF2, but there is no JWT/session token flow yet.
- API relay endpoint relies on username/password per request.
- Request limiting is IP-based and stored in MongoDB.
- Consider adding HTTPS termination and stronger rate limiting for internet-facing deployment.

## Logging

Winston logs to:

- Console
- `logs/logfile.txt`

## Useful Scripts

- `npm start` - start production server
- `npm run dev` - start nodemon development server
- `npm run lint` - run ESLint
- `npm run lint:fix` - auto-fix lint issues
- `npm run format` - run Prettier on JS/HBS/JSON

## Deployment Tips (Raspberry Pi)

- Run as a service (`systemd`) so app restarts automatically.
- Ensure the process user has permission to access GPIO.
- Keep `NODE_ENV=production` in production and fix the `developement` typo in code when ready.
- Put a reverse proxy (Nginx/Caddy) in front for TLS.

## License

ISC
