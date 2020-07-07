FROM python:3.7-buster

# RUN useradd -ms /bin/bash cieuser

RUN apt-get update \
  && apt-get install -y default-libmysqlclient-dev build-essential


COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip install -r requirements.txt
RUN venv/bin/pip install gunicorn

COPY database database
COPY services services
COPY payment payment
COPY *.py secrets.json run_cie_api.sh ./
RUN chmod +x run_cie_api.sh

ENV FLASK_APP main.py

# RUN chown -R cieuser:cieuser ./
# USER cieuser

EXPOSE 5000
ENTRYPOINT ["./run_cie_api.sh"]