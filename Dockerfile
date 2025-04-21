FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Set environment variables
ENV PORT=3002
ENV IP=0.0.0.0
ENV NODE_ENV=production

# Expose the port the app will run on
EXPOSE 3002

# Command to run the application
CMD ["node", "server.js"] 