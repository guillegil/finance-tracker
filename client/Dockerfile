# ---------------------------------------------------
# STAGE 1: Build the React Application
# ---------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies first (Caching strategy!)
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ---------------------------------------------------
# STAGE 2: Serve with Nginx
# ---------------------------------------------------
FROM nginx:alpine AS production

# Copy the built artifacts from the 'builder' stage to Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Standard Web Port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]