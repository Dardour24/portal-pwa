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
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/dist /app/dist

# Expose port 80
EXPOSE 80

# Start a simple HTTP server to serve the static files
CMD ["npx", "serve", "-s", "dist", "-l", "80"]
