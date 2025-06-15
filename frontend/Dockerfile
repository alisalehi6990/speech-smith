# Stage 1: Build the app
FROM node:20 as builder

ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=${VITE_BASE_API_URL}
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the app using NGINX
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]