# Build stage
FROM node:20.18.0-slim AS builder

WORKDIR /app

# Install procps for ps command
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20.11.1-slim

WORKDIR /app

# Install procps for ps command
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
