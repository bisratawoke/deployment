FROM alpine:3.10

RUN apk add --update docker openrc

RUN rc-update add docker boot 

RUN apk add --update nodejs npm

RUN apk add --update npm

WORKDIR /usr/bin/app 

RUN mkdir deploy

COPY . .

RUN npm i

CMD ["npm", "run", "prod"]
