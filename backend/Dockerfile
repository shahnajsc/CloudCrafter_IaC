# Base
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copy package and install dependencies
COPY package*.json ./
RUN npm install

# Copy app files
COPY tsconfig.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src
COPY --chmod=755 entrypoint.sh /usr/local/bin

#Port :: Allow external services to connect
EXPOSE 3000

#Entrypoint script :: Defines what should run when container starts
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
