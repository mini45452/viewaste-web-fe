# Use an official Node runtime as a parent image
FROM node:16-alpine as build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve app with Nginx
FROM nginx:alpine

# Copy the build output to replace the default Nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Generate SSL certificates
RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -nodes -new -x509 -keyout /etc/nginx/ssl/server.key -out /etc/nginx/ssl/server.cert -subj "/C=US/ST=State/L=City/O=Organization/OU=OrgUnit/CN=localhost"

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 37101 for HTTPS
EXPOSE 37101

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]
