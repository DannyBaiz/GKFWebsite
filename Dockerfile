FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY . .
RUN npm run prisma:generate || true
RUN npm run build
ENV NODE_ENV=production
CMD ["npm","start"]
