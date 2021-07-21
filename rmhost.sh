#! /bin/bash

domain_name = $1

docker stop facebook.com

docker rm facebook.com

docker rmi facebook.com

echo $domain_name


