import Product from '../models/productModel.js';

// @desc    Tạo một sản phẩm mới
// @route   POST /
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category } = req.body;
        const product = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
        });
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy tất cả sản phẩm
// @route   GET /
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy một sản phẩm theo ID
// @route   GET /:id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Cập nhật một sản phẩm
// @route   PUT /:id
export const updateProduct = async (req, res) => {
    const { name, description, price, imageUrl, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.imageUrl = imageUrl || product.imageUrl;
        product.category = category || product.category;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
};

// @desc    Xóa một sản phẩm
// @route   DELETE /:id
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne(); // Dùng deleteOne() thay cho remove() đã cũ
            res.json({ message: 'Sản phẩm đã được xóa' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server khi xóa sản phẩm' });
    }
};