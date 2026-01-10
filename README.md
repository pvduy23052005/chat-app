# Real-time Chat Application

> Ứng dụng nhắn tin thời gian thực hiện đại, hỗ trợ chat 1-1, chat nhóm, quản lý thành viên và chia sẻ đa phương tiện. Được xây dựng bằng **Node.js**, **TypeScript** và **MongoDB**.

![Node](https://img.shields.io/badge/Node.js-v18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)

## Tính năng chính

### Real-time Communication
- **Nhắn tin tức thì:** Sử dụng **Socket.IO** để gửi và nhận tin nhắn ngay lập tức mà không cần reload trang.
- **Trạng thái Online/Offline:** Hiển thị trạng thái hoạt động của bạn bè.
- **Typing Indicator:** Hiển thị khi người khác đang soạn tin nhắn.
- **Thông báo Real-time:** Nhận thông báo ngay lập tức khi có người thêm bạn vào nhóm hoặc rời nhóm.

###  Quản lý Phòng Chat (Room & Group)
- **Chat 1-1:** Trò chuyện riêng tư với bạn bè.
- **Chat Nhóm:**
  - Tạo nhóm mới, đặt tên và ảnh đại diện nhóm.
  - **Phân quyền:** Trưởng nhóm (Super Admin) và Thành viên.
  - **Chỉnh sửa:** Đổi tên nhóm (chỉ Super Admin ), cập nhật thông tin.
  - **Quản lý thành viên:** Thêm bạn bè vào nhóm, mời rời nhóm (Kick), tự rời nhóm.
  - **Bảo mật:** Chỉ Trưởng nhóm mới có quyền xóa nhóm hoặc xóa thành viên khác.

### Tiện ích khác
- **Gửi ảnh:** Hỗ trợ upload và xem ảnh trong khung chat (tích hợp xem trước ảnh).
- **Load more:** Xem lại tin nhắn cũ .
- **Thông báo hệ thống:** Hiển thị tin nhắn hệ thống (System Message) khi có sự kiện đặc biệt (Rời nhóm, Thêm thành viên).
- **Bạn bè:** Danh sách bạn bè, tìm kiếm và kết bạn.

## Công nghệ sử dụng

- **Backend:** Node.js, Express.js
- **Language:** TypeScript ,javascript
- **Database:** MongoDB (Mongoose)
- **Frontend:** Pug (Template Engine), CSS/Bootstrap 
- **Real-time:** Socket.IO
- **Upload:** Cloudinary 

## Cài đặt và Chạy dự án

### Các bước cài đặt

1.  **Clone dự án:**
    ```bash
    git clone https://github.com/pvduy23052005/chat-app.git
    cd chat-app
    ```

2.  **Cài đặt thư viện:**
    ```bash
    npm install
    ```

3.  **Cấu hình biến môi trường:**
    Tạo file `.env` ở thư mục gốc (copy từ `.env.example` nếu có) và điền các thông tin sau:
    ```env
    PORT=5050
    MONGO_URL=mongodb://localhost:5050/chat-app
    ```

4.  **Biên dịch TypeScript:**
    ```bash
    npm run build
    ```
    *(Hoặc nếu muốn chạy chế độ development để code, dùng lệnh: `npm run watch`)*

5.  **Khởi chạy Server:**
    ```bash
    npm start
    ```

6.  **Truy cập ứng dụng:**
    Mở trình duyệt và vào địa chỉ: `http://localhost:5050`

## Cấu trúc thư mục

```text
src/
├── controllers/    # Logic xử lý (Chat, Room, User...)
├── models/         # MongoDB Schemas (Mongoose)
├── views/          # Giao diện (Pug templates & Mixins)
├── public/         # File tĩnh (CSS, JS Client, Images)
├── routes/         # Định nghĩa đường dẫn (API & View)
├── socket/         # Logic xử lý Socket.IO (Server side)
├── middlewares/    # Auth, Upload, Validation
└── index.ts        # Entry point (Khởi tạo Server & Database)
