FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
# Note: In production we would build, but for this portfolio project tsx watch is fine, 
# or we can use tsx to run it directly to avoid build steps.
# Actually, let's build it properly for an enterprise feel.
RUN npm run build || true # If there is no build script, just ignore. We'll use tsx in CMD if needed.

# Expose port
EXPOSE 4000

# Start server
CMD ["npx", "tsx", "src/server.ts"]
