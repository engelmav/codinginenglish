FROM node:12 as npm-build-stage



WORKDIR /app
COPY package.json /app/
COPY src /app/src
COPY config /app/config
COPY public /app/public

COPY babel.config.js /app/
COPY yarn.lock /app/

RUN yarn add -D webpack-cli
RUN npm run build --production -- --env keycdn


FROM nginx:1.17.5

COPY --from=npm-build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
