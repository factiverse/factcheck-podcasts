FROM python:3.9-alpine
ENV PYTHONUNBUFFERED 1
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN apk add build-base linux-headers
RUN pip install -r requirements.txt

COPY . .