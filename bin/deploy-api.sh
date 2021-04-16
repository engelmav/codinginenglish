sudo docker build -t vengelmann/cie-api api/ && sudo docker push vengelmann/cie-api && kubectl rollout restart deployment cie-api

