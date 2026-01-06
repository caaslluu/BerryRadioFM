FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache sox git sudo libsndfile

COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
COPY client ./client

RUN npm install && cd server && npm install && cd ../client && npm install && npm run build && mv dist build

COPY server ./server
COPY bin/fm_transmitter /opt/berryradio/fm_transmitter

RUN chmod +x /opt/berryradio/fm_transmitter && mkdir -p /opt/berryradio/music && chmod 777 /opt/berryradio/music

EXPOSE 5000

CMD ["node", "server/server.js"]
