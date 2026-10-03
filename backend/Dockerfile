FROM node:18-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]
