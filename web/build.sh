SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
rm -rf $SCRIPTPATH/build
npm --prefix $SCRIPTPATH run build --production
sudo docker build -f $SCRIPTPATH/Dockerfile.snapshot -t cie-web $SCRIPTPATH --no-cache 
