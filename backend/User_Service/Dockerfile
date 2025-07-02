# Use the official Node.js image as the base
FROM node:20.19.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json 
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 4003

# Start the application
CMD ["npm", "start"]