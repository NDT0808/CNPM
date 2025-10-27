import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // Still needed for cart count if shown elsewhere, but link is hidden for admin

const Header = () => {
    const { userInfo, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="bg-gray-800 text-white shadow-md">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold hover:text-yellow-400 transition-colors duration-200">
                    FoodFast 🍔
                </Link>

                {/* Navigation Links - Right Side */}
                <div className="flex items-center gap-4 md:gap-6">

                    {userInfo ? (
                        // --- USER IS LOGGED IN ---
                        <>
                            {userInfo.isAdmin ? (
                                // --- ADMIN VIEW ---
                                <>
                                    <Link to="/admin/productlist" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                                        Sản phẩm
                                    </Link>
                                    <Link to="/admin/orderlist" className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors duration-200">
                                        Đơn hàng (Admin)
                                    </Link>
                                    {/* Add more admin links here if needed */}
                                </>
                            ) : (
                                // --- REGULAR USER VIEW ---
                                <>
                                    <Link to="/cart" className="hover:text-yellow-400 transition-colors duration-200 relative">
                                        Giỏ hàng
                                        {cartItemCount > 0 &&
                                            <span className="absolute -top-2 -right-3 ml-1 bg-yellow-500 text-black text-xs font-bold rounded-full px-2 py-0.5">
                                                {cartItemCount}
                                            </span>
                                        }
                                    </Link>
                                    <Link to="/myorders" className="hover:text-yellow-400 transition-colors duration-200">
                                        Đơn hàng
                                    </Link>
                                </>
                            )}

                            {/* Common for logged-in users */}
                            <span className="text-gray-400 hidden sm:inline">Chào, {userInfo.name}</span>
                            <button
                                onClick={logout}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors duration-200"
                            >
                                Đăng Xuất
                            </button>
                        </>

                    ) : (
                        // --- USER IS LOGGED OUT ---
                        <>
                            <Link to="/login" className="hover:text-yellow-400 transition-colors duration-200">Đăng Nhập</Link>
                            <Link to="/register" className="hover:text-yellow-400 transition-colors duration-200">Đăng Ký</Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;