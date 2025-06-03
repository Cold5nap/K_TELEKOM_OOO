#!/bin/sh

until mysqladmin ping -h"db" -P"3306" -u"admin" -p"admin" --silent; do
  echo "Ждем MySQL..."
  sleep 2
done

echo "MySQL готов!"
exec "$@"