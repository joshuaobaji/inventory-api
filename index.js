const express = require('express');
const app = express();
const PORT = 3000;

// Middleware (This allows your app to understand JSON data)
app.use(express.json());

// A simple "Health Check" route
// This tells you if the server is alive.
app.get('/', (req, res) => {
    res.send('Server is running! Ready to manage inventory.');
});

// --- MOCK DATABASE ---
// In a real app, this would be MongoDB or SQL.
// Here, we use an array to store data temporarily while the server runs.
let products = [
    { id: 1, name: "Laptop", price: 150000 },
    { id: 2, name: "Phone", price: 80000 }
];

// --- ROUTES ---

// 1. GET ALL PRODUCTS
// When someone visits http://localhost:3000/products, show them the list.
app.get('/products', (req, res) => {
    res.status(200).json(products);
});

// 2. CREATE A PRODUCT (POST)
// This allows us to send NEW data to the server.
app.post('/products', (req, res) => {
    const newProduct = req.body; // The data sent by the user

    // Simple validation: Ensure the product has an ID, Name, and Price
    if (!newProduct.name || !newProduct.price) {
        return res.status(400).send("Product must have a name and price");
    }

    // Add to our "database"
    products.push(newProduct);

    // Send back a success message
    res.status(201).json({
        message: "Product added successfully!",
        product: newProduct
    });
});

// 3. GET A SINGLE PRODUCT (Dynamic Route)
// Use :id to capture the ID from the URL (e.g., /products/1)
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id); // Convert "1" string to number
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    res.json(product);
});



// 4. DELETE A PRODUCT
app.delete('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);

    if (index === -1) {
        return res.status(404).send("Product not found");
    }

    // Remove the item from the array
    const deletedProduct = products.splice(index, 1);

    res.json({
        message: "Product deleted",
        product: deletedProduct
    });
});

// 5. UPDATE A PRODUCT (PUT)
app.put('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).send("Product not found");
    }

    // Only update the fields that the user sent
    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;

    res.json({
        message: "Product updated successfully",
        product: product
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});