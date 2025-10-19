# Use Node.js base image
FROM node:22

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all backend files
COPY . .

# Expose your backend port (change if needed)
EXPOSE 4001

# Set environment variables (optional)
# ENV NODE_ENV=production

# Command to start your server
CMD ["node", "server.js"]