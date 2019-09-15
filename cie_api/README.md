# Set up the Coding in English Backend

Follow these steps in order; feel free to modify as desired (e.g., swap out database or skip that step and point to a hosted instance).

## Set up a database

Ensure you're in an environment with Python >= 3.6.

0. Stand up a database with database name `cie`. See  `api/db/README.md`.
1. Install requirements. `pip install -r requirements.txt`
2. Populate database schema. `python api/db_schema.py

## Set up Secrets

0. You will need to provide a follow with the name `secrets.json` either in the root of the project (ADD TO YOUR .gitignore!) or elsewhere. If you put it somewhere else, specify its location by setting the environnment variable `CIE_SECRETS`.

0. `cie.auth.google.clientsecret` - Your Google Log-in OAuth secret
1. `ciedb.password` - the database password (see `api/db/README.md`, or refer to your hosted service)

## Redis
``docker run --name cie-redis -d -p 6379:6379 redis`` or to restart ``docker start cie-redis``

## Local Dev Cert for RocketChat

```
$ openssl genrsa -des3 -out rootCA.key 2048
$ openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem
```

Set up server.csr.cnf:
```
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn

[dn]
C=US
ST=RandomState
L=RandomCity
O=RandomOrganization
OU=RandomOrganizationUnit
emailAddress=hello@example.com
CN = localhost
```

Create v3.ext file:
```
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
```
Generate key:
```
openssl req -new -sha256 -nodes -out server.csr -newkey rsa:2048 -keyout server.key -config <( cat server.csr.cnf )
```

Generate cert:
```
openssl x509 -req -in server.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out server.crt -days 500 -sha256 -extfile v3.ext
```