#!/bin/sh
set -e

# Copy files from lovable-uploads to the target directory
if [ -d "/app/public/lovable-uploads" ]; then
  cp -r /app/public/lovable-uploads/* /usr/share/nginx/html/lovable-uploads/ 2>/dev/null || true
  cp -r /app/public/lovable-uploads/* /usr/share/nginx/html/ 2>/dev/null || true
fi 