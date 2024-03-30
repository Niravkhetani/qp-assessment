FROM node:16.18.1-alpine3.16

RUN mkdir -p /home/node/app/node_modules 

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install \
	&& npm install typescript -g

COPY --chown=node:node . .

EXPOSE 3005

CMD [ "npm", "start" ]