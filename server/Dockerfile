FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# 1. Copy source code (including prisma/schema.prisma)
COPY . .

# 2. NEW: Generate the Prisma Client for the container OS
RUN npx prisma generate

# 3. Build the app
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]