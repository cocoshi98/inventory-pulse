// backend/server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000; // Backend will run on port 5000

// Enable CORS to allow the frontend to access the backend
app.use(cors());
app.use(express.json()); // For parsing application/json

// Path to the JSON file
const dataFilePath = path.join(__dirname, 'data.json');

// Read data from the JSON file
const readDataFromFile = () => {
    const rawData = fs.readFileSync(dataFilePath);
    return JSON.parse(rawData);
  };

// Save data to the JSON file
const writeDataToFile = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(dataFilePath, jsonData);
  };

// Get all items (read from data.json)
app.get('/api/items', (req, res) => {
    const items = readDataFromFile();
    res.json(items);
  });

// Add a new item
app.post('/api/items', (req, res) => {
    const newItem = req.body;
    const items = readDataFromFile();
    newItem.id = items.length ? items[items.length - 1].id + 1 : 1;
    items.push(newItem);
    writeDataToFile(items); // Save the updated data to data.json
    res.status(201).json(newItem);
});

// Delete an item by id
app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    let items = readDataFromFile();
    items = items.filter(item => item.id != id);
    writeDataToFile(items); // Save the updated data to data.json
    res.status(200).json({ message: 'Item deleted' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
