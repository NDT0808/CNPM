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

    KAFKA --> PROD
    KAFKA --> ORDER
    KAFKA --> SOCKET
    
    SOCKET -.-> A & B
