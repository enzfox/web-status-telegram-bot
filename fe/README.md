# Web Status Telegram Bot Frontend

### Clone

```bash
git clone https://github.com/enzfox/web-status-telegram-bot.git
```

### Install dependencies

```bash
cd web-status-telegram-bot/fe
npm install
```

### Environment variables

```bash
cp .env.example .env
```

Update the `.env` file with your firebase config.

To enable the registration feature on the login page, set `VITE_REGISTRATION_ENABLED=true` in the `.env` file.

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Firebase Deploy

```bash
npm run deploy
```

or

```bash
firebase deploy --only hosting
```
