# This dockerfile is used to publish the `ohif/app` image on dockerhub.
#
# It's a good example of how to build our static application and package it
# with a web server capable of hosting it as static content.
#
# docker build
# --------------
# If you would like to use this dockerfile to build and tag an image, make sure
# you set the context to the project's root directory:
# https://docs.docker.com/engine/reference/commandline/build/
#
#
# SUMMARY
# --------------
# This dockerfile has two stages:
#
# 1. Building the React application for production
# 2. Setting up our Nginx (Alpine Linux) image w/ step one's output
#
#  user usr/src/app as alternative for /app as workdir to be accessible from any part of the docker image
#

# Stage 1: Build the application
# docker build -t ohif/viewer:latest .
FROM node:21-alpine3.17 as json-copier


RUN mkdir /app
WORKDIR /app

COPY ["package.json", "yarn.lock", "preinstall.js", "./"]
COPY extensions /app/extensions
COPY modes /app/modes
COPY neuralsight-extensions /app/neuralsight-extensions
COPY neuralsight-modes /app/neuralsight-modes
COPY platform /app/platform

# Find and remove non-package.json files
#RUN find extensions \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf
#RUN find modes \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf
#RUN find platform \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

# Copy Files
FROM node:20-alpine3.17 as builder
RUN mkdir /app
WORKDIR /app

COPY --from=json-copier /app .

# Run the install before copying the rest of the files
RUN yarn config set workspaces-experimental true
RUN yarn install --frozen-lockfile --verbose

#Copy everything else on the working directory
COPY . .

# Run extensions and mode
RUN yarn run cli list
RUN yarn run cli link-extension /app/neuralsight-extensions/neuralsight-tools
RUN yarn run cli link-mode /app/neuralsight-modes/custom-viewer
RUN yarn run cli list


# To restore workspaces symlinks
RUN yarn install --frozen-lockfile --verbose

ENV PATH /app/node_modules/.bin:$PATH
ENV QUICK_BUILD true
# ENV GENERATE_SOURCEMAP=false
ENV REACT_APP_CONFIG=config/neuralsight.js

RUN yarn run build

# Stage 3: Bundle the built application into a Docker container
# which runs Nginx using Alpine Linux
FROM nginxinc/nginx-unprivileged:1.23.1-alpine as final
#RUN apk add --no-cache bash
ENV PORT=3000
RUN rm /etc/nginx/conf.d/default.conf
USER nginx
COPY --chown=nginx:nginx .docker/Viewer-v3.x /app
RUN chmod 777 /app/entrypoint.sh
COPY --from=builder /app/platform/app/dist /usr/share/nginx/html
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
