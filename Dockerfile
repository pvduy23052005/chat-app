# 1. Chọn Base Image (Node 18 bản nhẹ)
FROM node:18-alpine

RUN apk add --no-cache tzdata
ENV TZ=Asia/Ho_Chi_Minh

# 2. Thiết lập thư mục làm việc trong container
WORKDIR /app

# 3. Copy file package để cài thư viện trước (Tận dụng cache của Docker)
COPY package*.json ./

# 4. Cài đặt dependencies
RUN npm install

# 5. Copy toàn bộ code nguồn vào container
COPY . .

# 6. Build TypeScript sang JavaScript
# (Lệnh này sẽ chạy script "build" trong package.json của bạn)
RUN npm run build

# 7. Mở port 5050 như bạn yêu cầu
EXPOSE 5050

# 8. Lệnh chạy app khi container khởi động
CMD ["npm", "start"]