# 🍚 FoodFast Delivery - Hệ thống Giao Cơm Tấm & Món Việt bằng Drone

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-green)](https://spring.io/projects/spring-boot)
[![React Native](https://img.shields.io/badge/Mobile-React%20Native-blue)](https://reactnative.dev/)
[![Kubernetes](https://img.shields.io/badge/Deployment-Kubernetes-326ce5)](https://kubernetes.io/)
[![Build Status](https://img.shields.io/badge/Build-Passing-success)]()



## 📖 Giới thiệu

**FoodFast Delivery** là nền tảng đặt món và giao hàng công nghệ cao, chuyên phục vụ các món ăn đặc trưng của Việt Nam như **Cơm Tấm, Phở, Bún chả...**. Dự án giải quyết bài toán vận chuyển trong đô thị đông đúc bằng cách ứng dụng công nghệ **Drone (Máy bay không người lái)** để giao hàng siêu tốc, kết hợp với hệ thống giám sát thời gian thực.

Hệ thống được xây dựng theo kiến trúc **Microservices hướng sự kiện (Event-Driven)**, đảm bảo tính toàn vẹn dữ liệu và khả năng mở rộng linh hoạt.

---

## 🎯 Mục tiêu dự án

Dự án tập trung giải quyết 4 vấn đề cốt lõi:
1.  **Trải nghiệm nhất quán:** Đồng bộ dữ liệu (Giỏ hàng, Lịch sử) tức thì giữa Web và Mobile App.
2.  **Vận hành minh bạch:** Khách hàng theo dõi được vị trí Drone trên bản đồ theo thời gian thực (Real-time) với độ trễ < 3s.
3.  **Hệ thống tin cậy:** Đảm bảo tính đúng đắn của tồn kho và giao dịch tài chính thông qua cơ chế **Compensation (Bù trừ/Rollback)**.
4.  **Khả năng mở rộng:** Kiến trúc Microservices cho phép dễ dàng tích hợp thêm nhà hàng hoặc đối tác vận chuyển mới.

---

## 🏗️ Kiến trúc hệ thống (System Architecture)

Hệ thống backend bao gồm **5 Microservices cốt lõi** giao tiếp bất đồng bộ qua **Message Broker (Kafka)**.

```mermaid
graph TD
    subgraph Client Side
        A["📱 Mobile App <br> (React Native)"]
        B["💻 Web App <br> (React.js)"]
    end

    subgraph Infrastructure
        GW("🌐 API Gateway")
        KAFKA["📨 Message Broker <br> (Kafka)"]
        SOCKET["🔔 Notification Service <br> (WebSocket)"]
    end

    subgraph Core Microservices
        USER["👤 User Service"]
        PROD["🍱 Product Service <br> (Inventory)"]
        ORDER["📝 Order Service"]
        PAY["💳 Payment Service <br> (VNPay)"]
        SHIP["🚁 Delivery Service <br> (Drone Logic)"]
    end

    A & B --> GW
    GW --> USER & PROD & ORDER & PAY & SHIP

    ORDER -- "OrderCreated" --> KAFKA
    PAY -- "PaymentProcessed" --> KAFKA
    SHIP -- "DeliveryUpdated" --> KAFKA

🛠️ Công nghệ sử dụng (Tech Stack)Phân lớpCông nghệMô tảBackend FrameworkSpring Boot (Java)Xây dựng các Microservices độc lập.Frontend WebReact.jsGiao diện người dùng trên trình duyệt.Frontend MobileReact NativeỨng dụng di động đa nền tảng (iOS/Android).DatabasePostgreSQLHệ quản trị cơ sở dữ liệu quan hệ.Message BrokerApache KafkaXử lý luồng sự kiện bất đồng bộ năng suất cao.ContainerizationDocker & KubernetesĐóng gói và điều phối container tự động.MonitoringPrometheus & GrafanaGiám sát hiệu năng và cảnh báo sự cố.PaymentVNPayCổng thanh toán điện tử tích hợp.🧩 Chi tiết chức năng các MicroservicesHệ thống được chia nhỏ thành các dịch vụ với chức năng chuyên biệt:1. 👤 User ServiceĐăng ký/Đăng nhập (Email, Password).Bảo mật: Cấp phát và xác thực JWT Token (Access & Refresh) cho từng phiên làm việc.Quản lý hồ sơ cá nhân và sổ địa chỉ giao hàng.2. 🍱 Product Service (Quản lý Sản phẩm & Kho)Quản lý thực đơn món Việt: Cơm tấm, Phở, Topping...Inventory Management: Quản lý số lượng tồn kho chính xác.Reserve Stock: Logic khóa tồn kho ngay khi người dùng đặt đơn để tránh bán quá số lượng.3. 📝 Order ServiceQuản lý vòng đời đơn hàng: Pending -> Paid -> Delivering -> Completed.Xử lý logic giỏ hàng (Cart).Cơ chế Bù trừ (Compensation): Tự động hủy đơn nếu thanh toán thất bại.4. 💳 Payment ServiceTích hợp cổng thanh toán VNPay.Tạo URL thanh toán bảo mật.Xử lý IPN/Callback để xác nhận giao dịch thành công/thất bại từ ngân hàng.5. 🚁 Delivery Service (Vận hành Drone)Tự động tìm kiếm và điều phối Drone hoặc Shipper gần nhất.Cập nhật trạng thái giao hàng: Finding Driver, Delivering, Delivered.Gửi tọa độ GPS/Trạng thái liên tục về hệ thống để tracking.6. 🔔 Notification ServiceLắng nghe sự kiện từ Kafka.Đẩy thông báo Real-time xuống Client qua WebSocket/SignalR.🔄 Các luồng nghiệp vụ chính (Key Business Flows)🛒 Luồng 1: Kiểm tra Tồn kho & Đặt hàngMục tiêu: Đảm bảo không bao giờ bán quá số lượng món ăn hiện có.Người dùng nhấn "Đặt hàng".Order Service gọi Product Service kiểm tra tồn kho.Nếu còn hàng: Hệ thống tạm giữ (Lock) số lượng món ăn -> Tạo đơn Pending -> Chuyển sang thanh toán.Nếu hết hàng: Báo lỗi ngay lập tức cho người dùng.💳 Luồng 2: Thanh toán & Rollback (Xử lý lỗi)Mục tiêu: Đảm bảo tính nhất quán dữ liệu khi giao dịch tiền tệ thất bại.Người dùng thực hiện thanh toán qua VNPay.Nếu thanh toán Thất bại (do hết tiền, hủy giao dịch):Payment Service bắn sự kiện PaymentFailed.Product Service nhận sự kiện -> Cộng lại số lượng tồn kho (Release Stock).Order Service nhận sự kiện -> Hủy đơn hàng.📡 Luồng 3: Theo dõi Drone thời gian thực (Real-time Tracking)Drone/Shipper cập nhật trạng thái -> Delivery Service.Delivery Service publish sự kiện DeliveryUpdated lên Kafka.Notification Service tiêu thụ sự kiện và đẩy xuống App User qua WebSocket.Màn hình người dùng hiển thị Icon Drone di chuyển mượt mà trên bản đồ.🖥️ Giao diện người dùng & Admin Portal📱 Client App (Web & Mobile)Trang chủ: Tìm kiếm món ăn, Banner khuyến mãi, Danh sách món ngon gợi ý.Giỏ hàng: Đồng bộ real-time giữa các thiết bị.Tracking: Bản đồ trực quan hiển thị lộ trình Drone và thời gian dự kiến (ETA).🛠️ Admin DashboardHeatmap (Bản đồ nhiệt): Giám sát mật độ đơn hàng và vị trí thời gian thực của toàn bộ đội bay Drone.Thống kê: Báo cáo doanh thu, số lượng đơn hàng theo ngày/tháng.Quản lý Menu: Thêm/Sửa/Xóa món ăn và cập nhật ảnh món ăn.Cảnh báo sự cố: Nhận thông báo ngay khi có Drone gặp trục trặc hoặc đơn hàng lỗi.📊 Yêu cầu phi chức năng (Non-functional Requirements)Hiệu năng: Thời gian phản hồi API trung bình < 500ms.Độ tin cậy: Hệ thống hoạt động 24/7 (Uptime 99.9%).Bảo mật: Toàn bộ giao tiếp qua HTTPS, mật khẩu được mã hóa (Hash), API được bảo vệ bằng JWT.Khả năng mở rộng: Các service có thể scale độc lập (Ví dụ: Giờ cao điểm có thể tăng số lượng container cho Order Service).🚀 Hướng dẫn Cài đặt & Triển khai (Local)Để chạy dự án trên máy cục bộ, vui lòng làm theo các bước sau:1. Yêu cầu hệ thốngJava JDK 17+Node.js & npmDocker Desktop & Docker Compose2. Cài đặtBước 1: Clone dự ánBashgit clone [https://github.com/FoodFast-Delivery/backend.git](https://github.com/FoodFast-Delivery/backend.git)
cd backend
Bước 2: Khởi chạy hạ tầng (Infrastructure)Sử dụng Docker Compose để chạy PostgreSQL, Kafka, Zookeeper, Zipline:Bashdocker-compose up -d
Bước 3: Chạy MicroservicesVào thư mục từng service và chạy lệnh:Bash./mvnw spring-boot:run
Bước 4: Chạy FrontendBashcd frontend/web-app
npm install
npm start
Đồ án môn học Công nghệ Phần mềmMade with ❤️ and 🍚 by FoodFast Team

    KAFKA --> PROD
    KAFKA --> ORDER
    KAFKA --> SOCKET
    
    SOCKET -.-> A & B
