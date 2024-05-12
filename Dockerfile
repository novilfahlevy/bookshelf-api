ARG NODE_VERSION=18.19.1
FROM node:${NODE_VERSION}-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app

# Copy the rest of the source files into the image.
COPY . .

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN npm install

# Expose the port that the application listens on.
EXPOSE 9000

# Run the application.
CMD npm start
