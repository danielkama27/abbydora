#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --production

echo "Generating Prisma client..."
npx prisma generate

echo "Starting AbbyDora..."
npm start
