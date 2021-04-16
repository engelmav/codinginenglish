sudo docker build -t vengelmann/cie-web web/ && sudo docker push vengelmann/cie-web && kubectl rollout restart deployment cie-web
