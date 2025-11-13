# 🍚 FoodFast Delivery - Hệ thống Giao Cơm Tấm & Món Việt bằng Drone

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-success)](https://github.com/PhucHungNhanba/CNPM_SGU.git)
[![Kubernetes](https://img.shields.io/badge/Deployment-Kubernetes-326ce5)](https://kubernetes.io/)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)

[cite_start]Hệ thống backend cho ứng dụng giao đồ ăn **"FoodFast Delivery"** (tiền thân là DRONE - FAST FOOD DELIVERY [cite: 3]), chuyên phục vụ các món ăn đặc trưng Việt Nam (Cơm Tấm, Phở, Bún chả...).

[cite_start]Dự án được xây dựng theo kiến trúc **Microservices hướng sự kiện (Event-Driven)**[cite: 32], ứng dụng công nghệ Drone để giao hàng. [cite_start]Mục tiêu là giải quyết các vấn đề về trải nghiệm người dùng không đồng nhất [cite: 5][cite_start], quy trình đặt hàng phức tạp [cite: 7] [cite_start]và thiếu công cụ theo dõi đơn hàng minh bạch trong các hệ thống hiện tại[cite: 6].

---

## 🎯 Mục tiêu dự án (Project Goals)

* [cite_start]✅ **Trải nghiệm nhất quán:** Cung cấp trải nghiệm đặt hàng nhanh chóng, tiện lợi và đồng bộ trên cả nền tảng Web (React.js) và Mobile (React Native)[cite: 22].
* [cite_start]✅ **Hệ thống tích hợp:** Tích hợp liền mạch các chức năng từ duyệt menu, giỏ hàng, thanh toán (VNPay) đến theo dõi đơn hàng trong một hệ thống duy nhất[cite: 23].
* [cite_start]✅ **Khả năng mở rộng:** Xây dựng hệ thống linh hoạt, dễ dàng mở rộng để tích hợp thêm các đối tác nhà hàng và dịch vụ vận chuyển mới[cite: 24].
* [cite_start]✅ **Độ ổn định và Giám sát:** Đảm bảo hệ thống hoạt động ổn định, có khả năng phục hồi cao và được giám sát theo thời gian thực[cite: 25].

---

## 🏗️ Kiến trúc hệ thống (System Architecture)

[cite_start]Hệ thống được thiết kế theo kiến trúc **Microservices hướng sự kiện** [cite: 32][cite_start], sử dụng **Message Broker (Kafka)** để giao tiếp bất đồng bộ giữa các dịch vụ[cite: 34].

* [cite_start]**Client (Web/Mobile):** Giao diện người dùng được xây dựng bằng React.js và React Native[cite: 10, 41].
* [cite_start]**API Gateway:** Là điểm vào duy nhất cho tất cả các yêu cầu từ Client, điều hướng đến các microservice phù hợp[cite: 34].
* [cite_start]**Core Microservices:** Gồm 5 dịch vụ chính (User, Product, Order, Payment, Delivery), mỗi dịch vụ có logic nghiệp vụ và cơ sở dữ liệu riêng[cite: 11, 46].
* [cite_start]**Messaging & Real-time:** Kafka xử lý các sự kiện[cite: 192, 254]. [cite_start]**Notification Service** lắng nghe các sự kiện này để gửi thông báo real-time tới người dùng qua WebSocket/SignalR[cite: 199, 257].

```mermaid
graph TD
    subgraph Frontend
        A["📱 Client <br> React.js / React Native"]
    end

    subgraph Backend Infrastructure
        B("🌐 API Gateway")
        F["📨 Message Broker <br> (Kafka)"]
        G["🔔 Notification Service"]
    end

    subgraph Core Microservices
        C["👤 User Service"]
        D["🍱 Product Service <br> (Quản lý Cơm Tấm, Phở...)"]
        E["📝 Order Service"]
        H["💳 Payment Service"]
        I["🚁 Delivery Service <br> (Logic Drone & Shipper)"]
    end

    A -- REST API --> B
    B --> C & D & E & H & I

    E -- "Publish: OrderCreated" --> F
    H -- "Publish: PaymentProcessed" --> F
    I -- "Publish: DeliveryUpdated" --> F

    F -- "Consume Event" --> E
    F -- "Consume Event" --> I
    F -- "Consume Event" --> G
    F -- "Consume Event" --> D %% Dành cho Rollback

    G -- WebSocket/SignalR --> A
````

-----

## 💻 Công nghệ sử dụng (Tech Stack)

| Hạng mục | Công nghệ | Biểu tượng | Ghi chú từ PRD |
| :--- | :--- | :--- | :--- |
| **Backend** | Spring Boot (Java) | 🍃 | [cite\_start]Framework chính cho Microservices[cite: 247]. |
| **Frontend** | React.js (Web), React Native (Mobile) | ⚛️ | [cite\_start]Đảm bảo trải nghiệm đa nền tảng [cite: 41, 229-230]. |
| **Database** | PostgreSQL | 🐘 | [cite\_start]Cơ sở dữ liệu quan hệ[cite: 45, 249]. |
| **Kiến trúc** | Microservices, Event-Driven | 🧩 | [cite\_start]Chia nhỏ hệ thống thành 5 service chính[cite: 46]. |
| **Message Broker** | Apache Kafka | 📨 | [cite\_start]Xử lý giao tiếp bất đồng bộ[cite: 34, 192]. |
| **CI/CD & Deployment**| Docker, Kubernetes (K8s) | 🐳 ☸️ | [cite\_start]Tự động hóa triển khai và mở rộng[cite: 54, 217]. |
| **Monitoring** | Prometheus, Grafana | 📈 📊 | [cite\_start]Giám sát hiệu năng real-time[cite: 56, 219]. |
| **Authentication** | JWT (JSON Web Token) | 🔑 | [cite\_start]Xác thực bảo mật cho API[cite: 179, 207]. |
| **Payment Gateway** | VNPay | 💳 | [cite\_start]Tích hợp thanh toán trực tuyến[cite: 50, 190]. |

-----

## 🔄 Luồng nghiệp vụ chính (Key Business Flows)

Hệ thống xử lý các nghiệp vụ phức tạp bằng cơ chế sự kiện bất đồng bộ:

### 1\. Luồng Kiểm tra Tồn kho (Inventory Check)

  * [cite\_start]**Mục tiêu:** Đảm bảo tính toàn vẹn dữ liệu tồn kho[cite: 67].
  * **Luồng:**
    1.  User nhấn "Đặt hàng".
    2.  [cite\_start]`Order Service` gọi `Product Service` để kiểm tra tồn kho[cite: 66].
    3.  [cite\_start]Nếu **Còn hàng**: `Product Service` cập nhật số lượng (giữ hàng) -\> `Order Service` tạo đơn `Pending` -\> Chuyển sang thanh toán [cite: 66-67].
    4.  [cite\_start]Nếu **Hết hàng**: Báo lỗi ngay lập tức cho người dùng[cite: 67].

### 2\. Luồng Phục hồi Tồn kho (Compensation / Rollback)

  * [cite\_start]**Mục tiêu:** Đảm bảo tính nhất quán cuối cùng (Eventual Consistency) khi giao dịch thất bại[cite: 94].
  * **Luồng:**
    1.  User thanh toán VNPay **thất bại** (do hủy, hết tiền...).
    2.  [cite\_start]`Payment Service` xử lý callback và publish sự kiện `PaymentProcessed` (Failed) lên Kafka [cite: 191-192].
    3.  [cite\_start]`Product Service` lắng nghe sự kiện này -\> Tự động **hoàn trả lại số lượng tồn kho** (Release Stock)[cite: 94].
    4.  [cite\_start]`Order Service` lắng nghe sự kiện -\> Cập nhật trạng thái đơn hàng thành `Cancelled`[cite: 188].

### 3\. Luồng Theo dõi Drone (Real-time Tracking)

  * [cite\_start]**Mục tiêu:** Cung cấp dữ liệu vị trí Drone thời gian thực mà không cần dùng GPS trực tiếp từ Drone (giả lập qua Event)[cite: 251].
  * **Luồng:**
    1.  [cite\_start]Delivery Service cập nhật trạng thái/vị trí (VD: Đang giao, Đã đến)[cite: 253].
    2.  [cite\_start]`Delivery Service` publish sự kiện `DeliveryUpdated` lên Kafka[cite: 254].
    3.  [cite\_start]`Notification Service` lắng nghe sự kiện này[cite: 256].
    4.  [cite\_start]`Notification Service` đẩy dữ liệu xuống Client App qua **WebSocket/SignalR**[cite: 257].
    5.  [cite\_start]Giao diện người dùng tự động cập nhật vị trí Drone 🚁 trên bản đồ[cite: 258].

-----

## ⚙️ Tính năng chính (Theo từng Service)

#### 👤 User Service

  * [cite\_start]Tạo tài khoản và đăng nhập bằng email/mật khẩu[cite: 176].
  * [cite\_start]Quản lý thông tin hồ sơ và địa chỉ giao hàng[cite: 178].
  * [cite\_start]Tạo và xác thực token **JWT** cho các phiên làm việc an toàn[cite: 179].

#### 🍱 Product Service (Quản lý Thực đơn)

  * [cite\_start]Cung cấp API lấy danh sách món ăn (Cơm Tấm, Phở...)[cite: 181].
  * [cite\_start]Admin quản lý sản phẩm (CRUD: thêm, sửa, xóa, cập nhật ảnh)[cite: 182].
  * [cite\_start]Quản lý số lượng tồn kho và cập nhật khi có đơn hàng[cite: 183].

#### 📝 Order Service (Quản lý Đơn hàng)

  * [cite\_start]Xử lý logic giỏ hàng (thêm, xóa, cập nhật)[cite: 185].
  * [cite\_start]Tạo đơn hàng mới với trạng thái "Pending"[cite: 186].
  * [cite\_start]Xem lịch sử và trạng thái đơn hàng[cite: 187].
  * [cite\_start]Cập nhật trạng thái dựa trên sự kiện từ Payment và Delivery Service[cite: 188].

#### 💳 Payment Service

  * [cite\_start]Tích hợp cổng thanh toán **VNPay**[cite: 190].
  * [cite\_start]Xử lý callback/webhook để xác nhận giao dịch thành công/thất bại[cite: 191].
  * [cite\_start]Publish sự kiện `PaymentProcessed` lên Kafka[cite: 192].

#### 🚁 Delivery Service (Điều phối Giao vận)

  * [cite\_start]Tiếp nhận đơn hàng đã thanh toán thành công[cite: 194].
  * [cite\_start]Quản lý trạng thái giao hàng (`Finding Driver`, `Delivering`, `Delivered`)[cite: 195].
  * [cite\_start]Cung cấp dữ liệu tracking real-time cho người dùng[cite: 196].

#### 🔔 Notification Service

  * [cite\_start]Lắng nghe sự kiện thay đổi trạng thái đơn hàng từ Kafka[cite: 198].
  * [cite\_start]Gửi Push Notification hoặc cập nhật qua WebSocket tới Client[cite: 199].

#### 🛠️ Admin Portal (Trang Quản trị)

  * [cite\_start]**Dashboard:** Thống kê doanh thu, tổng đơn hàng, số Drone hoạt động[cite: 201].
  * [cite\_start]**Heatmap:** Bản đồ nhiệt hiển thị vị trí Drone thực tế[cite: 202].
  * [cite\_start]**Quản lý sự cố:** Cảnh báo lỗi thanh toán hoặc Drone gặp trục trặc[cite: 203].

-----

## 📊 Yêu cầu phi chức năng (Non-Functional Requirements)

  * [cite\_start]**Bảo mật:** API xác thực bằng JWT, giao tiếp qua HTTPS [cite: 207-208].
  * [cite\_start]**Hiệu năng:** Thời gian phản hồi API chính ≤ 500ms[cite: 210].
  * [cite\_start]**Tính sẵn sàng:** Hệ thống chịu lỗi tốt, Uptime cao, database có cơ chế backup [cite: 213-214].
  * [cite\_start]**Khả năng mở rộng:** Các service scale độc lập bằng Kubernetes [cite: 216-217].
  * [cite\_start]**Giám sát:** Theo dõi real-time qua Prometheus/Grafana, dashboard riêng cho từng service [cite: 219-220].
  * [cite\_start]**Triển khai:** Tự động hóa hoàn toàn qua CI/CD pipeline[cite: 221].

-----

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu

  - Java Development Kit (JDK)
  - Docker và Docker Compose
  - Git
  - Maven hoặc Gradle

### Các bước cài đặt

1.  **Clone repository:**

    ```bash
    git clone [https://github.com/PhucHungNhanba/CNPM_SGU.git](https://github.com/PhucHungNhanba/CNPM_SGU.git)
    cd CNPM_SGU
    ```

2.  **Cấu hình biến môi trường:**
    Trong thư mục của mỗi microservice, sao chép file `application.yml.example` thành `application.yml` và điền các thông tin cần thiết (Database URL, Kafka Broker, JWT Secret...).

3.  **Chạy bằng Docker Compose (Khuyến khích):**
    *Khởi chạy hạ tầng (Kafka, Zookeeper, PostgreSQL, Grafana...)*

    ```bash
    docker-compose up -d
    ```

4.  **Chạy các Microservices (Local):**
    Mở Terminal cho từng service và chạy:

    ```bash
    ./mvnw spring-boot:run
    ```

5.  **Dừng hệ thống:**

    ```bash
    docker-compose down
    ```

-----

Made with ❤️ and 🍚 by **FoodFast Team**

```
```
