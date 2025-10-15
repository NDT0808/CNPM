# Dự án Backend Food Delivery - Microservices

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/your-repo)

Đây là hệ thống backend cho một ứng dụng giao đồ ăn, được xây dựng theo kiến trúc microservices. Hệ thống được thiết kế để phục vụ cho một client ReactJS, giao tiếp thông qua API RESTful với định dạng dữ liệu JSON.

## Mục lục

- [Sơ đồ kiến trúc](#sơ-đồ-kiến-trúc)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Tính năng chính](#tính-năng-chính)
- [Cài đặt và Chạy dự án](#cài-đặt-và-chạy-dự-án)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [API Endpoints](#api-endpoints)
- [Đóng góp](#đóng-góp)
- [Giấy phép](#giấy-phép)

## Sơ đồ kiến trúc

Hệ thống bao gồm 4 microservices chính, một API Gateway để điều hướng request từ client, và cơ sở dữ liệu riêng cho mỗi service để đảm bảo tính độc lập.

```
+---------------------+      +------------------+      +--------------------+
|   Client (ReactJS)  |----->|   API Gateway    |----->|   User Service     |
+---------------------+      | (e.g., Nginx)    |      +--------------------+
                             +------------------+                |
                                     |                         +--------------------+
                                     |------------------------>|   Product Service  |
                                     |                         +--------------------+
                                     |                                 |
                                     |                         +--------------------+
                                     |------------------------>|    Order Service   |
                                     |                         +--------------------+
                                     |                                 |
                                     |                         +--------------------+
                                     |------------------------>|   Payment Service  |
                                     |                         +--------------------+
                                     |
                                     v
                           (Inter-service communication
                             e.g., REST API, RabbitMQ)
```

## Công nghệ sử dụng

- **Backend:** Node.js, Express.js (hoặc Java/Spring Boot, Python/Django/Flask)
- **Database:**
  - **User Service:** MongoDB
  - **Product Service:** MongoDB / PostgreSQL
  - **Order Service:** PostgreSQL / MySQL
  - **Payment Service:** PostgreSQL / MySQL
- **Giao tiếp:** REST API, JSON
- **Xác thực:** JSON Web Tokens (JWT)
- **Containerization:** Docker, Docker Compose
- **API Gateway:** Nginx, Ocelot, hoặc tự xây dựng bằng Node.js.

## Tính năng chính

#### 1. User Service
- Đăng ký, đăng nhập tài khoản.
- Quản lý thông tin cá nhân (profile).
- Xác thực và phân quyền người dùng (user, admin, shipper).
- Quản lý địa chỉ.

#### 2. Product Service
- Quản lý thông tin nhà hàng/quán ăn.
- Quản lý danh mục món ăn (category).
- Quản lý món ăn (thêm, sửa, xóa, xem chi tiết).
- Tìm kiếm và lọc món ăn/nhà hàng.

#### 3. Order Service
- Tạo đơn hàng mới.
- Xem lịch sử đơn hàng.
- Cập nhật trạng thái đơn hàng (đang xử lý, đang giao, đã giao, đã hủy).
- Lấy thông tin chi tiết đơn hàng.

#### 4. Payment Service
- Tích hợp cổng thanh toán (ví dụ: Momo, VNPay, Stripe - hoặc tạo mock API).
- Xử lý giao dịch thanh toán cho đơn hàng.
- Cập nhật trạng thái thanh toán.
- Hoàn tiền (refund) khi đơn hàng bị hủy.

## Cài đặt và Chạy dự án

### Yêu cầu
- [Node.js](https://nodejs.org/) (phiên bản 16.x trở lên)
- [Docker](https://www.docker.com/) và [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Các bước cài đặt

1.  **Clone repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo.git](https://github.com/your-username/your-repo.git)
    cd your-repo
    ```

2.  **Cấu hình biến môi trường:**
    Mỗi microservice sẽ có một file `.env.example`. Hãy sao chép và đổi tên thành `.env` và cấu hình các biến cần thiết (như chuỗi kết nối database, secret key cho JWT, port,...).

    Ví dụ cho `user-service`:
    ```bash
    cd user-service
    cp .env.example .env
    # Mở file .env và chỉnh sửa các giá trị
    ```
    Lặp lại cho các service khác.

3.  **Chạy bằng Docker Compose (Khuyến khích):**
    Đây là cách đơn giản nhất để khởi chạy tất cả các services và database cùng lúc.
    ```bash
    docker-compose up -d
    ```
    Để dừng tất cả các container:
    ```bash
    docker-compose down
    ```

4.  **Chạy thủ công từng service (Tùy chọn):**
    Nếu không dùng Docker, bạn có thể chạy từng service một cách thủ công. Mở một terminal cho mỗi service.

    ```bash
    # Terminal 1: User Service
    cd user-service
    npm install
    npm start

    # Terminal 2: Product Service
    cd ../product-service
    npm install
    npm start

    # ... Lặp lại cho Order và Payment Service
    ```

## Cấu trúc thư mục

Dự án được tổ chức theo mô hình monorepo, mỗi service là một thư mục riêng biệt.

```
/food-delivery-backend
├── /user-service
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── /product-service
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── /order-service
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── /payment-service
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

Đây là một số ví dụ về các endpoints chính. Vui lòng tham khảo tài liệu API chi tiết (Swagger/Postman) để biết thêm thông tin.

#### User Service (`/api/v1/users`)
- `POST /register`: Đăng ký người dùng mới.
- `POST /login`: Đăng nhập và nhận token JWT.
- `GET /profile`: Lấy thông tin cá nhân của người dùng đã đăng nhập.
- `PUT /profile`: Cập nhật thông tin cá nhân.

#### Product Service (`/api/v1/products`)
- `GET /restaurants`: Lấy danh sách nhà hàng.
- `GET /restaurants/:id`: Lấy chi tiết một nhà hàng.
- `GET /items`: Tìm kiếm món ăn.
- `GET /items/:id`: Lấy chi tiết một món ăn.

#### Order Service (`/api/v1/orders`)
- `POST /`: Tạo một đơn hàng mới.
- `GET /`: Lấy lịch sử đơn hàng của người dùng.
- `GET /:id`: Lấy chi tiết một đơn hàng.
- `PUT /:id/status`: Cập nhật trạng thái đơn hàng (dành cho admin/shipper).

#### Payment Service (`/api/v1/payments`)
- `POST /create-payment-intent`: Tạo một phiên thanh toán cho đơn hàng.
- `POST /webhook`: Nhận thông báo kết quả thanh toán từ cổng thanh toán.

## Đóng góp

Chúng tôi luôn chào đón các đóng góp! Vui lòng làm theo các bước sau:
1.  Fork project.
2.  Tạo một branch mới (`git checkout -b feature/AmazingFeature`).
3.  Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`).
4.  Push lên branch (`git push origin feature/AmazingFeature`).
5.  Mở một Pull Request.

## Giấy phép

Dự án này được cấp phép theo Giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.
