# Stage 1: Build environment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package management files
COPY package*.json ./
COPY tsconfig.json ./
# Copy prisma directory for generation
COPY prisma ./prisma/

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Generate Prisma Client
RUN npx --yes prisma generate

# Copy the rest of the application code
COPY . .

# Build the TypeScript project (fails if compilation fails)
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy package management files and prisma directory
COPY package*.json ./
COPY prisma ./prisma/

# Install ONLY production dependencies to keep image size small
RUN npm install --omit=dev

# Generate Prisma Client for the production environment
RUN npx --yes prisma generate

# Copy the compiled Javascript from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the application port
EXPOSE 4000

# Apply database migrations and start the compiled application
CMD npx --yes prisma migrate deploy && npm start
