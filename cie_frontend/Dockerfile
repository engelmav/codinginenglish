FROM node:10 as npm-build-stage


WORKDIR /app
COPY package*.json /app/
RUN npm ci --only=production
COPY ./ /app

RUN npm run build --production


WORKDIR /app/zoom
COPY zoom_frontend/package*.json /app/zoom/
RUN npm ci --only=production
COPY ./zoom_frontend/ /app/zoom


FROM nginx:1.17.5

COPY --from=npm-build-stage /app/build /usr/share/nginx/html
COPY --from=npm-build-stage /app/zoom /usr/share/nginx/html/zoom

COPY nginx.conf /etc/nginx/conf.d/default.conf
