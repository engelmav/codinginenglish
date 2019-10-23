#!/usr/bin/env bash
echo "*** Importing CIE schema"
mysql -u root -p$MYSQL_ROOT_PASSWORD < /tmp/schema.sql
mysql -u root -p$MYSQL_ROOT_PASSWORD -e "grant all privileges on *.* to 'appuser'@'%';"
