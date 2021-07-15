#! /bin/sh

echo $domain_name

touch Dockerfile

touch default.conf



echo "server { \n listen 80; \n server_name $domain_name; \n   location / { root /usr/bin/app; \n index index.html;\n } \n } " > default.conf

echo "FROM nginx:alpine \n WORKDIR /usr/bin/app \n COPY ./files . \n COPY ./default.conf /etc/nginx/conf.d/"  > Dockerfile


docker build -t $domain_name .





