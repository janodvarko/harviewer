FROM node:8.11.2-jessie as builder

RUN apt-get update -y && \
    apt-get install -y ant

ADD . /build

WORKDIR /build

RUN npm install && \
    ant build 

FROM php:apache

MAINTAINER marcello.desales@gmail.com
LABEL github.com https://github.com/marcellodesales/harviewer

COPY --from=builder /build/webapp-build /var/www/html

EXPOSE 80
