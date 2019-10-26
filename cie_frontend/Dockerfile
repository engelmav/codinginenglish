FROM node:10 as npm-build-stage


WORKDIR /app
COPY package*.json /app/
RUN npm ci --only=production
COPY ./ /app

RUN npm run build --production

FROM nginx:1.17.5

COPY --from=npm-build-stage /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
