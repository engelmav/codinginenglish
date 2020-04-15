FROM mongo:3.6
COPY replicaSet.js .
CMD ["/bin/bash", "-c", "mongo mongo/rocketchat < replicaSet.js"]