# Web Status Telegram Bot Frontend

### Clone

```bash
git clone https://github.com/als698/web-status-telegram-bot.git
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

To enable the registration feature on the login page, set `NEXT_PUBLIC_REGISTRATION_ENABLED=true` in the `.env` file.

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm run start
```

### Firebase Deploy

Check the Next.js [deployment documentation](https://firebase.google.com/docs/hosting/frameworks/nextjs).
