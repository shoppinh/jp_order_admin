FROM node:16-alpine as build-stage
# Set the working directory to /app
WORKDIR /app
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application code to the container
COPY . .

ARG REACT_APP_API_URL http://localhost:8080

ENV REACT_APP_API_URL $REACT_APP_API_URL
# Build the production version of the application
RUN npm run build

FROM nginx:1.21.0-alpine as production-stage

ENV NODE_ENV production


RUN mkdir /app

COPY --from=build-stage /app/build /app

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
# Run the command to start the server
CMD ["nginx", "-g", "daemon off;"]
