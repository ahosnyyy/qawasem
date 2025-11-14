# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Docker

### Build the Docker Image

```bash
docker build -t qawasem:latest .
```

### Run the Docker Container

Run on port 80:
```bash
docker run -d -p 80:80 --name qawasem-app qawasem:latest
```

Or use a custom port (e.g., 3000):
```bash
docker run -d -p 3000:80 --name qawasem-app qawasem:latest
```

### Access Your Application

- If using port 80: http://localhost
- If using port 3000: http://localhost:3000

### Useful Docker Commands

**View running containers:**
```bash
docker ps
```

**View container logs:**
```bash
docker logs qawasem-app
```

**Stop the container:**
```bash
docker stop qawasem-app
```

**Start the container again:**
```bash
docker start qawasem-app
```

**Remove the container:**
```bash
docker rm -f qawasem-app
```

**Remove the image:**
```bash
docker rmi qawasem:latest
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
