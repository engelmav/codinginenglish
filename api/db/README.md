# Get the MySQL Docker Image

```
docker pull mysql/mysql-server:8.0.16-1.1.11
```

# Initial Database Setup

Replace `CIE_PASSWORD` with whatever you want, but be sure to specify it in `api/secrets.json`.

```
docker run --name ciemysql -e MYSQL_DATABASE=cie -e MYSQL_USER=appuser -e MYSQL_PASSWORD=$CIE_MYSQL_PASSWORD mysql/mysql-server
```
