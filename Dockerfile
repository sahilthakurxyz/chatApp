# ------------------------------
# 🧱 Base Image
# ------------------------------
FROM node:20

# Set working directory inside container
WORKDIR /app

# ------------------------------
# 📦 Install dependencies (backend only)
# ------------------------------
# Copy backend package.json files
COPY server/package*.json ./

# Install only production dependencies
RUN npm install --production

# ------------------------------
# 🧩 Copy backend source code
# ------------------------------
# Copy only the server folder contents (not frontend)
COPY server/ .

# ------------------------------
# 🌍 Expose dynamic Railway port
# ------------------------------
# Railway automatically sets PORT env variable
ENV PORT=8080
EXPOSE 8080

# ------------------------------
# 🚀 Start the backend server
# ------------------------------
CMD ["node", "server.js"]