echo Running devserver on port 8080
sudo docker run --add-host cie-api:127.0.0.1 -p 8080:80 cie-web
