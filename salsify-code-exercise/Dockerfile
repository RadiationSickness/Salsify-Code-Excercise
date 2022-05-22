# base image
FROM node:16.10.0

WORKDIR /app

COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli@13.3.6

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0