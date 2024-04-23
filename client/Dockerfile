# Use the official Node.js LTS image as base
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend source code to the working directory
COPY . .

# Expose port 5173 for the frontend application
EXPOSE 5173

# Command to run the frontend application
CMD ["npm", "run", "dev"]
