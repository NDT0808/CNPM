const express = require('express');
const dotenv = require('dotenv');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`🚀 Payment Service is running on http://localhost:${PORT}`);
});