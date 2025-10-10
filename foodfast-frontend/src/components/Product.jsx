// src/components/Product.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

const Product = ({ product }) => {
    return (
        // 2. Bọc toàn bộ thẻ div bằng component Link
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="product-card">
                <img src={product.imageUrl} alt={product.name} style={{ width: '150px' }} />
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <p>Giá: {product.price.toLocaleString('vi-VN')} VNĐ</p>
            </div>
        </Link>
    );
};

export default Product;