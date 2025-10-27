import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product';        // Import thẻ Product
import ErrorDisplay from '../components/ErrorDisplay'; // Import component báo lỗi

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/api/products');
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

    if (loading) return null; // Không hiển thị gì khi tải

    if (error) {
        return <ErrorDisplay message={error} />;
    }

    return (
        // 1. Thêm nền tối để khớp với Header
        // 2. Thêm "container mx-auto" để "vừa kích thước web"
        <div className="bg-white-900 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">

                {/* Tiêu đề trang */}
                <div className="text-center mb-10 md:mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        Thực Đơn Của Chúng Tôi
                    </h1>
                    <p className="text-lg text-gray-400">
                        Khám phá các món ăn 🍔 và đồ uống 🥤 tuyệt vời nhất.
                    </p>
                </div>

                {/* 3. Thêm "grid" để chia cột cho sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? (
                        products.map((product) => (
                            // 4. Gọi component Product cho mỗi món ăn
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