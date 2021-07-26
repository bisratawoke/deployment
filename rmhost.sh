#! /bin/bash


if [[ $1 = "static" ]]
then 
 echo "static"
elif [[ $1 = "nodejs" ]]
then
 echo "nodejs"
elif [[ $1  = "php" ]]
then
 echo "php"
else
  echo "error"
fi

