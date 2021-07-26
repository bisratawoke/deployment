#! /bin/bash

echo $domain_name
echo $type
echo $1

if [[ $1 = "static" ]]
then
  touch Dockerfile

  touch default.conf

  echo $'server { \n listen 80; \n server_name $domain_name; \n   location / { root /usr/bin/app; \n index index.html;\n } \n } ' > default.conf

  echo $'FROM nginx:alpine \n WORKDIR /usr/bin/app \n COPY ./files . \n COPY ./default.conf /etc/nginx/conf.d/'  > Dockerfile

  docker build -t $domain_name .

  docker run --name $domain_name -d --network haproxytest_tester $domain_name

elif [[ $1 = "nodejs" ]]
then
  
  touch Dockerfile
  
  echo $ 'here \n baby'
  
  echo $'FROM node:16-alpine \n WORKDIR /usr/bin/app \n COPY ./files . \n RUN npm i \n CMD ["npm","run","start"]' > Dockerfile
  
  docker build -t $domain_name .
  
  docker run --name $domain_name -d --network haproxytest_test $domain_name
  
  echo 'didint build '

else
 echo "php deployment"
fi


