# sudo docker build -t vengelmann/cie-web --no-cache web/ && sudo docker push vengelmann/cie-web && kubectl rollout restart deployment cie-web
bash web/build.sh && sudo docker push vengelmann/cie-web && kubectl rollout restart deployment cie-web
 