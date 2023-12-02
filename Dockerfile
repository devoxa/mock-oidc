## Builder ##

FROM node:21.3-alpine AS builder
WORKDIR /application

# Install the NPM dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Compile the source code
COPY . ./
RUN yarn build

# Install the runtime dependencies
RUN yarn install --production --frozen-lockfile

## Runner ##

FROM node:21.3-alpine AS runner
WORKDIR /application
ENV NODE_ENV production

# Install the OS dependencies (for signal forwarding)
RUN apk add --no-cache tini

# Copy the compiled application
COPY --from=builder /application/node_modules ./node_modules
COPY --from=builder /application/dist ./dist
COPY --from=builder /application/run.sh run.sh

# Run the application
EXPOSE 8093
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["./run.sh"]
