# 🎵 Spotify Clone – Fullstack Project (Django + React)
## ⚙️ Yêu cầu hệ thống

Trước khi bắt đầu, hãy đảm bảo hệ thống của bạn đã cài đặt và cấu hình các thành phần sau:

- **Node.js** (>= 18.x): Dùng để chạy frontend React qua Vite.
- **Python** (>= 3.10): Dùng cho backend Django.
- **MongoDB**: Có thể dùng MongoDB Atlas (cloud) hoặc MongoDB local; chỉ cần thay đổi chuỗi kết nối trong file `.env`.

## 🚀 Cách cài đặt và chạy ứng dụng

### 1. Clone dự án về máy

Dùng lệnh Git để lấy toàn bộ source code về máy:

```bash
git clone https://github.com/angsongji/Spotify_clone.git
cd Spotify_clone
```

---

### 2. Chạy Backend (Django)

#### a) Cài đặt môi trường và công cụ:

```bash
sudo apt-get update
sudo apt-get install python3-pip python3-venv docker.io
```

#### b) Tạo và kích hoạt môi trường ảo:

```bash
python3 -m venv env         # Tạo virtualenv
source env/bin/activate     # Linux/macOS
.\env\Scripts ctivate      # Windows
```

#### c) Cài đặt thư viện Python:

```bash
pip install -r requirements.txt
```

> 📦 File `requirements.txt` bao gồm Django, Django Channels, djongo (hoặc pymongo), v.v.

#### d) Tạo SECRET_KEY:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

#### e) Cấu hình biến môi trường:

1. Đổi tên file `.env-example` thành `.env`:

```bash
cp .env-example .env
```

2. Mở file `.env` và thay đổi giá trị cho các biến cấu hình sau:

```env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_STORAGE_BUCKET_NAME=...
AWS_S3_REGION_NAME=...
SECRET_KEY=...               # Sao chép key được tạo ra từ lệnh tạo SECRET_KEY ở trên
URI_MONGODB_DATABASE=...     # mongodb://localhost:27017/ hoặc mongodb+srv://...
```

#### f) Chạy migration:

```bash
python manage.py migrate
```

#### g) Chạy Redis bằng Docker:

```bash
sudo docker run -d -p 6379:6379 --name spotify_redis redis
```

Kiểm tra container Redis:

```bash
sudo docker ps
```

> ✅ Nếu có container `spotify_redis` đang chạy, Redis đã sẵn sàng.

#### h) Khởi chạy server Django:

```bash
python runserver.py
```

> 🌐 Server sẽ lắng nghe tại `http://localhost:8000`

---

### 3. Chạy Frontend (React + Vite)

#### a) Di chuyển vào thư mục `frontend`:

```bash
cd ../frontend #Nếu bạn đang ở thư mục backend
```
hoặc
```bash
cd frontend #Nếu bạn đang ở thư mục gốc Spotify_clone
```

#### b) Cài đặt các package:

```bash
npm install
```

#### c) Chạy ứng dụng React:

```bash
npm run dev
```

> 🌐 Truy cập giao diện tại `http://localhost:5173`

---

## 📁 Cấu trúc thư mục chính

- `backend/` – Mã nguồn Django, file `requirements.txt`, `.env-example`, và `runserver.py`
- `frontend/` – Mã nguồn React, `package.json`, cấu hình Tailwind và Vite

---

## ⚠️ Ghi chú & lưu ý khi deploy

- Đảm bảo file `.env` chứa đầy đủ thông tin môi trường (SECRET_KEY, MongoDB URI, v.v.)
- Kiểm tra firewall để đảm bảo cổng 8000 (backend) và 3000 (frontend) được mở
- Khi deploy production:
  - Đặt `DEBUG=False`
  - Cấu hình SSL/HTTPS
  - Sử dụng reverse proxy như Nginx để tối ưu bảo mật và hiệu suất

---

