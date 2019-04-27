Get the MySQL Docker Image

```
docker pull mysql/mysql-server:8.0.16-1.1.11
```

Initial Database Setup

```
docker run --name mysql1 -e MYSQL_DATABASE=cie -e MYSQL_USER=appuser -e MYSQL_PASSWORD=appuser mysql/mysql-server
```
