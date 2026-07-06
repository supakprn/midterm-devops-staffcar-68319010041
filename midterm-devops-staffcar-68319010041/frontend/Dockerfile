# frontend/Dockerfile
# แบบ HTML + Vanilla JS: ไม่มีขั้นตอน build ใช้ FROM nginx แล้ว COPY ไฟล์เข้าไปเสิร์ฟได้เลย
FROM nginx:1.27-alpine

COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
