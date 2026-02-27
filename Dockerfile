FROM node:24-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_API_URL=http://localhost:8080/
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY <<'EOF' /etc/nginx/conf.d/default.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    absolute_redirect off;

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
EOF

EXPOSE 80
