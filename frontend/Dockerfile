FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && npm install

COPY src ./src
COPY tsconfig.json tsconfig.node.json vite.config.ts tailwind.config.js postcss.config.js index.html ./

EXPOSE 3000

CMD ["npm", "run", "dev"]
