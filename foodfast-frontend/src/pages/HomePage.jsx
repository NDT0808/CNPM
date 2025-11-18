<<<<<<< HEAD
﻿// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product.jsx';      // Import thẻ Product
import ErrorDisplay from '../components/ErrorDisplay.jsx'; // Import component báo lỗi
import HeroSection from '../components/HeroSection.jsx';   // Import HeroSection
=======
﻿import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';        // Import thẻ Product
import ErrorDisplay from '../components/ErrorDisplay'; // Import component báo lỗi
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
<<<<<<< HEAD
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
=======
                const response = await axios.get('http://localhost:3000/api/products');
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
                setProducts(response.data);
                setError(null);
            } catch (err) {
                setError('Rất tiếc, không thể tải dữ liệu sản phẩm.');
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

<<<<<<< HEAD
    // Không hiển thị gì khi đang tải để tránh layout bị nhảy
    if (loading) return null;

    // Hiển thị component lỗi nếu có lỗi
=======
    if (loading) return null; // Không hiển thị gì khi tải

>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
    if (error) {
        return <ErrorDisplay message={error} />;
    }

    return (
<<<<<<< HEAD
        // Đã sửa `bg-white-900` thành `bg-white` (hoặc bạn có thể dùng `bg-gray-50` cho nền xám nhạt)
        <div className="bg-white min-h-screen">

            {/* 1. Thêm HeroSection (banner) ở đầu trang */}
            <HeroSection />

            {/* 2. Container cho phần nội dung còn lại */}
=======
        // 1. Thêm nền tối để khớp với Header
        // 2. Thêm "container mx-auto" để "vừa kích thước web"
        <div className="bg-white-900 min-h-screen">
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
            <div className="container mx-auto p-4 md:p-8">

                {/* Tiêu đề trang */}
                <div className="text-center mb-10 md:mb-12">
<<<<<<< HEAD
                    {/* Sửa `to-black -500` thành `to-gray-800` */}
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-orange-700 leading-tight mb-6">
                        Thực Đơn Của Chúng Tôi
                    </h1>
                    {/* Sửa `text-black-400` thành `text-gray-600` */}
                    <p className="text-lg text-gray-600">
=======
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Thực Đơn Của Chúng Tôi
                    </h1>
                    <p className="text-lg text-gray-400">
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
                        Khám phá các món ăn 🍔 và đồ uống 🥤 tuyệt vời nhất.
                    </p>
                </div>

<<<<<<< HEAD
                {/* 3. Lưới hiển thị sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
=======
                {/* 3. Thêm "grid" để chia cột cho sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            // 4. Gọi component Product cho mỗi món ăn
>>>>>>> 62d0cde0a996486415924094f6084c5fdfeab9e8
                            <Product key={product._id} product={product} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 text-lg py-10">
                            Hiện chưa có sản phẩm nào để hiển thị.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;