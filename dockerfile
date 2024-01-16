FROM node:latest AS development

WORKDIR /usr/src/app

COPY package*.json ./

# Install both development and production dependencies
RUN npm install

COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:latest AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
