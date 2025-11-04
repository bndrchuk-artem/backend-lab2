FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# prestart автоматично запустить міграції
CMD [ "npm", "start" ]