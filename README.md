# Scrapping Freqty Token

A Node.js TypeScript application that scrapes Freqty tokens using Playwright.

## Docker Setup

### Build Image

```shell
docker build -t scrapping-token .
```

### Run Container

Make sure you have a `credentials.json` file in your project root before running:

```shell
# Run normally with cron schedule
docker run --name scrapping-token-app -d \
  -v $(pwd)/credentials.json:/app/credentials.json:ro \
  -v $(pwd)/.env:/app/.env:ro \
  scrapping-token

# Run once without cron
docker run --name scrapping-token-app \
  -v $(pwd)/credentials.json:/app/credentials.json:ro \
  -v $(pwd)/.env:/app/.env:ro \
  scrapping-token npm run once
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```shell
cp .env.example .env
```

### Credentials

Create a `credentials.json` file based on `credentials.json.example`:

```shell
cp credentials.json.example credentials.json
```

Then edit the file with your actual credentials.
