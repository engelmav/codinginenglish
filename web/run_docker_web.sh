IP=`hostname -I  | awk '{ print $1}'`
echo Running devserver on port 8080, mapping cie-api to $IP

sudo docker run --add-host cie-api:$IP -p 8080:80 cie-web
