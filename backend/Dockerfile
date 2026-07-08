FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN npm install
RUN npx nest build

EXPOSE 3000

CMD ["node", "dist/main.js"]
