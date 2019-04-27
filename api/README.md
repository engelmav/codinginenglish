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
