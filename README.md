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
.\env\Scripts ctivate       # Windows
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

#### i) Thêm IP vào whitelist (Nếu dùng MongoDB Atlas):
👨‍💻 Kết nối MongoDB Atlas
Nếu bạn sử dụng MongoDB Atlas (cloud), cần đảm bảo IP của bạn được cho phép truy cập:

Truy cập MongoDB Atlas và đăng nhập bằng tài khoản đã đăng ký.

Khi vừa đăng nhập lần đầu, Atlas sẽ hiển thị thông báo yêu cầu chấp nhận IP hiện tại (Allow access from current IP).
👉 Hãy nhấn nút "Add Current IP Address" để cho phép kết nối từ máy của bạn.

Nếu đã bỏ qua bước này, bạn có thể vào phần "Network Access" > "IP Whitelist" để thêm địa chỉ IP thủ công.

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

## 🔍 Lưu ý

- Nếu dùng MongoDB Atlas, đảm bảo IP của bạn đã được thêm vào whitelist trong Network Access.
- Các biến môi trường trong file `.env` phải được cấu hình chính xác để server hoạt động.
- Backend mặc định chạy ở cổng `8000`, frontend ở cổng `5173`. Đảm bảo các cổng này không bị chiếm dụng.


---

