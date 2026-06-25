// ⚡ 1. IMPORT DEPENDENCIES — Pulling in the Express routing engine [1]
const express = require('express');

// 📊 2. INITIALIZE SERVER APP — Creating our waiter instance
const app = express();

// Define a safe local port for our server to listen to
const PORT = 5000;

// Middleware to parse incoming JSON payloads automatically
app.use(express.json());

// 🛠️ 3. DEFINE API ROUTE — Creating our first menu item
// When a browser requests 'GET /products', we return our digital inventory list!
app.get('/products', (req, res) => {
    // We use new Array() and.push() to bypass bracket-filtering bugs [2]
    const products = new Array();
    
    products.push({
        id: 1,
        name: "Premium Canvas Sneaker",
        price: 350.00
    });
    
    products.push({
        id: 2,
        name: "Vintage Graphic Tee",
        price: 180.00
    });
    
    // Return a 200 success code along with our data formatted as JSON [1]
    res.status(200).json(products);
});

// 🚀 4. START LISTENING — Telling our server to stand on the floor
app.listen(PORT, () => {
    console.log(`⚡ Server is actively running on: http://localhost:${PORT}`);
});
