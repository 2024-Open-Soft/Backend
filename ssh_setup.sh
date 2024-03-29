#!/bin/bash
# for running this script , ./script.sh email
EMAIL="manaswiraj195@kgpian.iitkgp.ac.in"
ssh-keygen -t rsa -b 4096 -C "$1"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
cat ~/.ssh/id_rsa.pub