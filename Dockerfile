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
# Added a much shorter interval and fewer retries for faster health check results
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=2 \
  CMD wget -q --spider http://localhost/ || \
      wget -q --spider http://localhost/health || \
      wget -q --spider http://localhost/status.txt || \
      wget -q --spider http://localhost/health.html || \
      exit 1

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Create a special directory for lovable-uploads
RUN mkdir -p /usr/share/nginx/html/lovable-uploads

# Copy the shell script
COPY copy-files.sh /copy-files.sh
RUN chmod +x /copy-files.sh

# Run the shell script to copy files
RUN /copy-files.sh

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy service worker files directly to ensure they're available
COPY public/sw.js /usr/share/nginx/html/sw.js
COPY public/sw/ /usr/share/nginx/html/sw/

# Create multiple health check files in various formats
RUN echo "healthy" > /usr/share/nginx/html/health && \
    echo "<!DOCTYPE html><html><body>Healthy</body></html>" > /usr/share/nginx/html/health.html && \
    echo "OK" > /usr/share/nginx/html/status.txt

# Add a standalone minimal HTML file that doesn't depend on anything
RUN echo '<!DOCTYPE html><html><head><title>Botnb</title><meta name="viewport" content="width=device-width"></head><body>Botnb is running. <a href="/">Go to main app</a></body></html>' > /usr/share/nginx/html/minimal.html

# Ensure index.html has proper DOCTYPE and create a fallback HTML
RUN if [ -f /usr/share/nginx/html/index.html ]; then \
    sed -i '1s/^/<!DOCTYPE html>\n/' /usr/share/nginx/html/index.html; \
    echo '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Botnb</title></head><body><div id="root">Loading...</div><script>window.addEventListener("load", function() { if (!document.getElementById("root").children.length) { window.location.href = "/?bypass-sw=true"; } });</script></body></html>' > /usr/share/nginx/html/fallback.html; \
    fi

# Copy manifest.json
COPY public/manifest.json /usr/share/nginx/html/manifest.json

# Create a simple favicon if not present
RUN if [ ! -f /usr/share/nginx/html/favicon.ico ]; then \
    echo "This is a placeholder favicon" > /usr/share/nginx/html/favicon.ico; \
    fi

# Expose port 80
EXPOSE 80

# Start Nginx directly
CMD ["nginx", "-g", "daemon off;"]
