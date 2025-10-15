# 🍔 FoodFast Delivery - Backend Microservices

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/your-username/your-repo)
[![Kubernetes](https://img.shields.io/badge/Deployment-Kubernetes-blue.svg)](https://kubernetes.io/)

[cite_start]Hệ thống backend cho ứng dụng giao đồ ăn **"DRONE - FAST FOOD DELIVERY"**[cite: 3], được xây dựng theo kiến trúc Microservices hướng sự kiện. [cite_start]Dự án nhằm giải quyết các vấn đề về trải nghiệm người dùng không đồng nhất [cite: 5][cite_start], quy trình đặt hàng phức tạp [cite: 7] [cite_start]và thiếu công cụ theo dõi đơn hàng minh bạch[cite: 6].

---

## 🎯 Mục tiêu dự án

* [cite_start]✅ **Trải nghiệm nhất quán:** Cung cấp trải nghiệm đặt hàng nhanh chóng, tiện lợi và nhất quán trên cả nền tảng Web và Mobile. [cite: 58]
* [cite_start]✅ **Hệ thống tích hợp:** Tích hợp liền mạch các chức năng từ duyệt menu, giỏ hàng, thanh toán đến theo dõi đơn hàng trong một hệ thống duy nhất. [cite: 59]
* [cite_start]✅ **Khả năng mở rộng:** Xây dựng hệ thống linh hoạt, dễ dàng mở rộng để tích hợp thêm các đối tác nhà hàng và dịch vụ vận chuyển mới. [cite: 60]
* [cite_start]✅ **Độ ổn định và Giám sát:** Đảm bảo hệ thống hoạt động ổn định, có khả năng phục hồi cao và được giám sát theo thời gian thực. [cite: 61]

---

## 🏗️ Kiến trúc hệ thống

[cite_start]Hệ thống được thiết kế theo kiến trúc **Microservices hướng sự kiện**, sử dụng **Message Broker (Kafka)** để giao tiếp bất đồng bộ giữa các dịch vụ. [cite: 27, 91, 97]

* [cite_start]**Client (Web/Mobile):** Giao diện người dùng được xây dựng bằng React.js và React Native. [cite: 32]
* [cite_start]**API Gateway:** Là điểm vào duy nhất cho tất cả các yêu cầu từ Client, điều hướng đến các microservice phù hợp. [cite: 27]
* [cite_start]**Core Microservices:** Gồm các dịch vụ chính, mỗi dịch vụ có logic nghiệp vụ và cơ sở dữ liệu riêng. [cite: 11, 27]
* [cite_start]**Messaging & Real-time:** Kafka xử lý các sự kiện và **Notification Service** lắng nghe để gửi thông báo real-time tới người dùng qua WebSocket/SignalR. [cite: 27, 98]

```mermaid
graph TD
    subgraph Frontend
        A[📱 Client <br> React.js / React Native]
    end

    subgraph Backend Infrastructure
        B(API Gateway)
        F[Message Broker <br> (Kafka)]
        G[🔔 Notification Service]
    end

    subgraph Core Microservices
        C[👤 User Service]
        D[🛍️ Product Service]
        E[🛒 Order Service]
        H[💳 Payment Service]
        I[🚚 Delivery Service]
    end

    A -- REST API --> B
    B --> C
    B --> D
    B --> E
    B --> H
    B --> I

    E -- Publishes Event --> F
    H -- Publishes Event --> F
    I -- Publishes Event --> F

    F -- Consumes Event --> E
    F -- Consumes Event --> I
    F -- Consumes Event --> G

    G -- WebSocket/SignalR --> A
```

---

## 💻 Công nghệ sử dụng

| Hạng mục | Công nghệ |
| :--- | :--- |
| **Frontend** | [cite_start]⚛️ React.js (Web), 📱 React Native (Mobile) [cite: 32, 123, 124] |
| **Backend** | [cite_start]🍃 Spring Boot (Java) [cite: 126] |
| **Database** | [cite_start]🐘 PostgreSQL (hoặc MySQL) [cite: 36, 128] |
| **Kiến trúc** | [cite_start]🧩 Microservices [cite: 11, 127] |
| **Message Broker** |  [cite_start]Kafka [cite: 91, 97] |
| **CI/CD & Deployment**| [cite_start]🐳 Docker, ☸️ Kubernetes [cite: 45, 111] |
| **Monitoring** | [cite_start]📈 Prometheus, 📊 Grafana [cite: 47, 113] |
| **Authentication** | [cite_start]🔑 JWT, 🔐 OAuth2 (Google, Facebook) [cite: 38, 76] |
| **Payment Gateway** | [cite_start]💳 VNPay, Momo [cite: 41, 89] |

---

## 🔄 Luồng hoạt động chính

1.  [cite_start]**Đăng nhập/Đăng ký:** Người dùng mở ứng dụng và truy cập vào tài khoản. [cite: 15]
2.  [cite_start]**Chọn món:** Duyệt menu, lựa chọn các món ăn và thêm vào giỏ hàng. [cite: 16]
3.  [cite_start]**Thanh toán:** Người dùng xác nhận đơn hàng và chọn phương thức thanh toán. [cite: 17] [cite_start]`Payment Service` sẽ xử lý giao dịch. [cite: 18]
4.  [cite_start]**Theo dõi đơn hàng:** `Order Service` cập nhật trạng thái, người dùng có thể theo dõi tiến trình giao hàng theo thời gian thực. [cite: 19]
5.  [cite_start]**Hoàn tất:** Người dùng nhận thông báo khi đơn hàng được giao thành công. [cite: 20]

---

## ⚙️ Tính năng chính (Theo từng Service)

#### 👤 User Service
* [cite_start]Tạo tài khoản và đăng nhập bằng email/mật khẩu. [cite: 75]
* [cite_start]Hỗ trợ đăng nhập qua OAuth2 (Google, Facebook). [cite: 76]
* [cite_start]Quản lý thông tin hồ sơ và địa chỉ giao hàng. [cite: 77]
* [cite_start]Tạo và xác thực token JWT. [cite: 78]

#### 🛍️ Product Service
* [cite_start]Cung cấp API để lấy danh sách và thông tin chi tiết món ăn. [cite: 80]
* [cite_start]Cho phép quản trị viên quản lý sản phẩm (thêm, sửa, xóa). [cite: 81]
* [cite_start]Quản lý và cập nhật số lượng tồn kho. [cite: 82]

#### 🛒 Order Service
* [cite_start]Xử lý logic giỏ hàng (thêm, xóa, cập nhật). [cite: 84]
* [cite_start]Tạo đơn hàng mới với trạng thái "Pending". [cite: 85]
* [cite_start]Cho phép người dùng xem lịch sử và trạng thái đơn hàng. [cite: 86]
* [cite_start]Cập nhật trạng thái đơn hàng dựa trên sự kiện từ `Payment` và `Delivery Service`. [cite: 87]

#### 💳 Payment Service
* [cite_start]Tích hợp cổng thanh toán VNPay, Momo. [cite: 89]
* [cite_start]Xử lý callback/webhook từ cổng thanh toán. [cite: 90]
* [cite_start]Publish sự kiện `PaymentProcessed` lên Kafka. [cite: 91]

#### 🚚 Delivery Service
* [cite_start]Tiếp nhận đơn hàng đã thanh toán thành công. [cite: 93]
* [cite_start]Quản lý và cập nhật các trạng thái giao hàng. [cite: 94]
* [cite_start]Cung cấp dữ liệu cho phép người dùng theo dõi đơn hàng real-time. [cite: 95]

#### 🔔 Notification Service
* [cite_start]Lắng nghe các sự kiện về đơn hàng từ Kafka. [cite: 97]
* [cite_start]Gửi thông báo đẩy (push notification) hoặc cập nhật qua WebSocket/SignalR. [cite: 98]

---

## 📊 Yêu cầu phi chức năng

* [cite_start]**Bảo mật:** Toàn bộ API được bảo vệ bằng JWT/OAuth2 và giao tiếp qua HTTPS. [cite: 101, 102]
* [cite_start]**Hiệu năng:** Thời gian phản hồi API chính ≤ 500ms, xử lý tải cao. [cite: 104, 105]
* [cite_start]**Tính sẵn sàng:** Hệ thống có độ sẵn sàng cao, CSDL có cơ chế sao lưu/phục hồi. [cite: 107, 108]
* [cite_start]**Khả năng mở rộng:** Mỗi microservice có thể được mở rộng độc lập bằng Kubernetes. [cite: 110, 111]
* [cite_start]**Giám sát:** Hiệu năng hệ thống được giám sát real-time qua Prometheus và Grafana. [cite: 113, 114]
* [cite_start]**Triển khai:** Quy trình CI/CD tự động hóa hoàn toàn. [cite: 115]

---

## 🚀 Cài đặt và Chạy dự án

*(Lưu ý: Phần này là mẫu đề xuất vì không có trong PRD)*

### Yêu cầu
- Java Development Kit (JDK)
- Docker và Docker Compose
- Git

### Các bước cài đặt
1.  **Clone repository:**
    ```bash
    git clone [https://github.com/your-username/foodfast-delivery.git](https://github.com/your-username/foodfast-delivery.git)
    cd foodfast-delivery
    ```
2.  **Cấu hình biến môi trường:**
    Trong thư mục của mỗi microservice, sao chép file `application.yml.example` thành `application.yml` và điền các thông tin cần thiết.

3.  **Chạy bằng Docker Compose (Khuyến khích):**
    ```bash
    docker-compose up -d --build
    ```
    Để dừng tất cả các container:
    ```bash
    docker-compose down
    ```
