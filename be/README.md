# Web Status Telegram Bot Backend

App to monitor website status and send notifications by a telegram bot

## Install

### Clone

```bash
git clone https://github.com/enzfox/web-status-telegramService-telegramService.git \
&& cd web-status-telegramService-telegramService 
```

Add your firebase credentials as `firebase-auth.json` to `web-status-telegramService-telegramService/be` directory.

### Run on Docker

```bash
docker compose up -d 
```

### or Run on local/server

#### Install dependencies

```bash
npm install
```

TSC and Nodemon are required to run the project. Install them globally if you haven't already.

```bash
npm install -g typescript nodemon
```

### Start the app

```bash
npm run start
```

### Watch

```bash
npm run watch
```

### Test

```bash
npm run test
```

### Build

The build script will be generated in the `dist` directory.

```bash
npm run build
```
