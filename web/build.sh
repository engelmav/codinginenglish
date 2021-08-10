SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
rm -rf $SCRIPTPATH/build
sudo docker build -f $SCRIPTPATH/Dockerfile.next -t cie-web-next $SCRIPTPATH
