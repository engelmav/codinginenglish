FROM node:12 as npm-build-stage



WORKDIR /app
COPY package*.json /app/

RUN yarn install --production
COPY ./ /app

RUN yarn add -D webpack-cli
RUN npm run build --production


FROM nginx:1.17.5

COPY --from=npm-build-stage /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
