FROM node:18-slim
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# Create a directory for persistent logs
CMD ["node", "index.js"]
