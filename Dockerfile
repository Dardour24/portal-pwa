
# Base image
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files
COPY . .

# Make sure environment variables are available at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_PREVIEW_MODE

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_PREVIEW_MODE=${VITE_PREVIEW_MODE}

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Add healthcheck to verify nginx is running properly
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost/health || exit 1

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy service worker files directly to ensure they're available
COPY public/sw.js /usr/share/nginx/html/sw.js
COPY public/sw/ /usr/share/nginx/html/sw/

# Ensure lovable-uploads folder exists
RUN mkdir -p /usr/share/nginx/html/lovable-uploads

# Make sure we have a correct doctype in index.html
RUN if [ -f /usr/share/nginx/html/index.html ]; then \
    sed -i '1s/^/<!DOCTYPE html>\n/' /usr/share/nginx/html/index.html; \
    fi

# Create a healthcheck file
RUN echo "healthy" > /usr/share/nginx/html/health.txt

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
