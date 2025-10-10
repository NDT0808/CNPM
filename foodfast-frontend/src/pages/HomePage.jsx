// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from '../components/Product'; // Import component Product

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/products');
                setProducts(response.data);
            } catch (err) {
                setError('Không thể tải dữ liệu sản phẩm.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <p>Đang tải sản phẩm...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Danh sách món ăn 🍔</h1>
            <div className="product-list">
                {products.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;