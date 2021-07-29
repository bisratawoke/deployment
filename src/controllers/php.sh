#! /bin/sh


touch Dockerfile


echo "FROM php:apache \n COPY ./files /var/www/html " > Dockerfile


docker build -t $domain_name .

	  
docker run --name $domain_name -d --network haproxytest_tester $domain_name
 
 
