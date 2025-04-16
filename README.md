# 📘 Blog Application

Ứng dụng Blog gồm 2 phần:
- 🖥️ **Backend**: Spring Boot (nhánh `master`)
- 🌐 **Frontend**: ReactJS (nhánh `front_react`)

---

## 🚀 1. Clone Backend (Spring Boot) – dùng IntelliJ IDEA

```
git clone -b master https://github.com/phamta/Blog-Application.git
```

Mở IntelliJ IDEA

Chọn File > Open, chọn thư mục Blog-Application

IntelliJ sẽ tự nhận dự án Maven/Spring Boot

Chạy file BlogApplication.java để start server

2. Clone Frontend (React) – dùng VS Code
Cách 1: Clone vào thư mục khác (gọn gàng)
Sao chép
Chỉnh sửa
```
git clone -b front_react https://github.com/phamta/Blog-Application.git blog-frontend
cd blog-frontend
```

Cách 2: Nếu đã clone repo Blog-Application, chuyển branch:
cd Blog-Application
git checkout front_react

3. Cài đặt và chạy frontend
cd frontend  # hoặc nơi bạn để React App
npm install
npm start
