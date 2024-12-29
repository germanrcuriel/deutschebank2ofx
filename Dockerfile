FROM node:20-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package.json package-lock.json /opt/app/
RUN npm install

COPY . /opt/app
EXPOSE 8080

CMD ["npm", "start"]
