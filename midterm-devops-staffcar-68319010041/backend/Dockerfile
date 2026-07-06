# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# ติดตั้ง dependencies ก่อน เพื่อใช้ Docker layer cache
COPY package*.json ./
RUN npm install --omit=dev

# คัดลอกโค้ดที่เหลือ
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
