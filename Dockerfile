
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

# Add multiple healthcheck endpoints for more robust monitoring
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q --spider http://localhost/ || \
      wget -q --spider http://localhost/health || \
      wget -q --spider http://localhost/index.html || \
      exit 1

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Create a special directory for lovable-uploads and copy everything there
RUN mkdir -p /usr/share/nginx/html/lovable-uploads
COPY --from=build /app/public/lovable-uploads/* /usr/share/nginx/html/lovable-uploads/

# Create a backup of these images directly in the root as fallback
COPY --from=build /app/public/lovable-uploads/* /usr/share/nginx/html/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy service worker files directly to ensure they're available
COPY public/sw.js /usr/share/nginx/html/sw.js
COPY public/sw/ /usr/share/nginx/html/sw/

# Create a healthcheck file and multiple fallback health indicators
RUN echo "healthy" > /usr/share/nginx/html/health && \
    echo "<!DOCTYPE html><html><body>Healthy</body></html>" > /usr/share/nginx/html/health.html && \
    echo "OK" > /usr/share/nginx/html/status.txt

# Ensure index.html has proper DOCTYPE and fallback
RUN if [ -f /usr/share/nginx/html/index.html ]; then \
    sed -i '1s/^/<!DOCTYPE html>\n/' /usr/share/nginx/html/index.html; \
    echo '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Botnb</title></head><body><div id="root">Loading...</div><script>window.addEventListener("load", function() { if (!document.getElementById("root").children.length) { window.location.href = "/?bypass-sw=true"; } });</script></body></html>' > /usr/share/nginx/html/fallback.html; \
    fi

# Copy manifest.json
COPY public/manifest.json /usr/share/nginx/html/manifest.json

# Expose port 80
EXPOSE 80

# Start nginx and create a simple health monitoring script
CMD ["nginx", "-g", "daemon off;"]
