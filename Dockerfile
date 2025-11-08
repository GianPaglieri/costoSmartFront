# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies with a clean reproducible lock
COPY package*.json ./
RUN npm ci

# Build React app
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
