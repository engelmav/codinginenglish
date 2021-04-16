#!/bin/bash
source venv/bin/activate
exec gunicorn -b :80 \
  --worker-tmp-dir /dev/shm \
  --access-logfile - \
  --log-level DEBUG \
  --workers=3 \
  --threads=4 \
  --worker-class flask_sockets.worker \
  main:app