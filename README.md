# 🎓 Website Sàn thương mại giáo dục - Antoree

Đây là một dự án Front-end xây dựng bằng **ReactJS**, xây dựng một giao diện cho sàn giáo dục thương mại điện tử tích hợp AI, nơi người dùng có thể tìm kiếm, khám phá và yêu thích các khoá học.

---

## 📸 Demo
> 👉 [Xem demo tại đây](https://timely-vacherin-79de7d.netlify.app/).

---

## 🧑‍💻 Công nghệ sử dụng

- ReactJS (Vite)
- TailwindCSS
- React Router DOM
- React Icons
- Axios
- Ant Design (Thông báo, comfirm)

---

## 📁 Cấu trúc thư mục tổng quát

```
Antoree/
├── public/data          # Dữ liệu cho trang web
├── src/
│   ├── assets/          # Ảnh, biểu tượng,...
│   ├── components/      # Các component dùng chung
│   ├── hooks/           # Custom hook dùng chung giữa các component 
│   ├── layouts/         # Layouts tổng
│   ├── pages/           # Các trang chính (Home, Search, ...)
│   ├── routes/          # Định tuyến
│   ├── services/        # Giao tiếp API
│   ├── utils/           # Các hàm tiện ích
│   ├── index.css        # Cấu hình css chung cho website
│   └── main.jsx         # Điểm bắt đầu ứng dụng
├── .gitignore
├── package.json
└── vite.config.js
```

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### Các bước thực hiện:

1. **Clone project từ GitHub**
   ```bash
   git clone https://github.com/angsongji/e-commerce_antoree Antoree
   cd Antoree
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   ```

3. **Chạy dự án ở chế độ development**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   ```

4. **Build dự án cho production**
   ```bash
   npm run build
   # hoặc
   yarn build
   ```

5. **(Tuỳ chọn) Preview bản build**
   ```bash
   npm run preview
   ```

---

## Về dự án

Dự án này là một dự án học tập, được xây dựng với mục đích thực hành và nâng cao kỹ năng lập trình React.
Không nhằm mục đích thương mại.
