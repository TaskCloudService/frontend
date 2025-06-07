# 1. Install dependencies and build
FROM node:18-alpine AS builder

# set working directory
WORKDIR /app

# build-time args
ARG NEXT_PUBLIC_AUTH_URL
ARG NEXT_PUBLIC_EVENTS_URL
ARG NEXT_PUBLIC_PROFILE_URL
ARG NEXT_PUBLIC_API_NOTE_URL
ARG NEXT_PUBLIC_API_BOOKINGS_URL
ARG NEXT_PUBLIC_CONTENT_URL

# make them available to Next.js at build time
ENV NEXT_PUBLIC_AUTH_URL=$NEXT_PUBLIC_AUTH_URL
ENV NEXT_PUBLIC_EVENTS_URL=$NEXT_PUBLIC_EVENTS_URL
ENV NEXT_PUBLIC_PROFILE_URL=$NEXT_PUBLIC_PROFILE_URL
ENV NEXT_PUBLIC_API_NOTE_URL=$NEXT_PUBLIC_API_NOTE_URL
ENV NEXT_PUBLIC_API_BOOKINGS_URL=$NEXT_PUBLIC_API_BOOKINGS_URL
ENV NEXT_PUBLIC_CONTENT_URL=$NEXT_PUBLIC_CONTENT_URL

# install dependencies (caches unless package.json changes)
COPY package*.json ./
RUN npm ci

COPY .env.local .env.local

# copy rest of the source code
COPY . .

# build the Next.js app
RUN npm run build

# 2. Prerender and optimize
FROM node:18-alpine AS runner

WORKDIR /app

# Only copy the necessary artifacts from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/node_modules ./node_modules

# expose the port Next.js will run on
EXPOSE 3000

# default command
CMD ["npm", "start"]
 