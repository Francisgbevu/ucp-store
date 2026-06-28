// ⚡ 1. IMPORT DEPENDENCIES — Pulling in the Express and CORS routing engines [1]
const express = require('express');
const cors = require('cors');

// 📊 2. INITIALIZE SERVER APP
const app = express();
const PORT = 5000;

// Enable CORS Handshakes so our browser catalog can fetch data safely 
app.use(cors());
app.use(express.json());

// 🛠️ 3. DEFINE API ROUTE
app.get('/products', (req, res) => {
    // Brackets-safe array initialization to prevent parsing issues [2]
    const products = new Array();
    
    products.push({
        id: "sneaker",
        name: "Premium Canvas Sneaker",
        price: 350.00
    });
    
    products.push({
        id: "tee",
        name: "Vintage Graphic Tee",
        price: 180.00
    });
    
    res.status(200).json(products);
});

// 🚀 4. START LISTENING
app.listen(PORT, () => {
    console.log(`⚡ Server is actively running on: http://localhost:${PORT}`);
});
