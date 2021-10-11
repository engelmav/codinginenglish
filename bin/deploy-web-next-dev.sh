APP_NAME=cie-web-next-dev
sudo docker build --no-cache -t vengelmann/$APP_NAME -f web/Dockerfile.next web/ \
  && sudo docker push vengelmann/$APP_NAME && kubectl rollout restart deployment $APP_NAME-deployment
 