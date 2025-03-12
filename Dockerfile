FROM node:22

# Switch to root user temporarily to install dependencies
USER root

# Install ffmpeg
# RUN apt-get update && \
#     apt-get install -y ffmpeg && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# Switch back to the node user
USER node

# Set environment variable to include /bin in PATH (optional, since /usr/bin is already in PATH)
ENV PATH="/bin:/home/node/.local/bin:$PATH"

WORKDIR /app

# Copy package files and install dependencies
COPY --chown=node package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY --chown=node . .

# Build the application
RUN yarn build

EXPOSE 7860

CMD ["yarn", "start"]