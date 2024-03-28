#!/bin/bash
docker build \
  --build-arg DATABASE_URL=$(cat .env | grep DATABASE_URL | cut -d '=' -f2) \
  --build-arg JWT_SECRET=$(cat .env | grep JWT_SECRET | cut -d '=' -f2) \
  -t shivmanas/backend:1.1 .