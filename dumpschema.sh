#!/bin/bash

kubectl exec -i $(kubectl get pods | grep cie-db | awk '{ print $1 }') -- mysqldump cie --no-data -uroot -p

