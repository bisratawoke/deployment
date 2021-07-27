#! /bin/sh
touch Dockerfile
  
echo  "here \n baby"
  
echo "FROM node:14-alpine \n WORKDIR /usr/bin/app \n COPY ./files . \n RUN npm i " > Dockerfile
  
docker build -t $domain_name .
  
docker run --name $domain_name -d --network haproxytest_tester $domain_name node app.js
  

