FROM node:20-alpine
WORKDIR /app

# Install pnpm (preferred for workspaces) and libc extras
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only manifests first for better layer caching
COPY package.json pnpm-lock.yaml* package-lock.json* ./

# Install dependencies (if lockfile exists pnpm will use it)
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile; \
	elif [ -f package-lock.json ]; then npm ci; \
	else pnpm install; fi

# Copy app source
COPY . .
EXPOSE 3000

# Default dev command (overridden in compose if needed)
CMD ["pnpm","dev","-p","3000"]
