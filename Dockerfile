# Base image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

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
