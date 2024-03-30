#!/bin/bash


file="$(cat .env)"

for line in $file
do
    echo -e "$line"
done

echo ${file[1]}