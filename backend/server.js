// backend/server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;  // Force to use 10000 or fallback to 10000

// Enable CORS to allow the frontend to access the backend
app.use(cors());
app.use(express.json()); // For parsing application/json

// Path to the JSON file
const dataFilePath = path.join(__dirname, 'data.json');

// Read data from the JSON file asynchronously
const readDataFromFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Save data to the JSON file asynchronously
const writeDataToFile = (data) => {
  return new Promise((resolve, reject) => {
    const orderedData = data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity
  }));
    const jsonData = JSON.stringify(orderedData, null, 2);
    fs.writeFile(dataFilePath, jsonData, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Get all items (read from data.json)
app.get('/api/items', async (req, res) => {
  try {
    const items = await readDataFromFile();
    res.json(items);
  } catch (err) {
    console.error('Error reading data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new item
app.post('/api/items', async (req, res) => {
  try {
    const newItem = req.body;
    const items = await readDataFromFile();
    newItem.id = items.length ? items[items.length - 1].id + 1 : 1;
    items.push(newItem);
    await writeDataToFile(items); // Save the updated data to data.json
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let items = await readDataFromFile();
    
    // Filter out the deleted item
    items = items.filter(item => item.id != id);

    // Reassign IDs sequentially
    items = items.map((item, index) => ({
      ...item,
      id: index + 1, // Ensure IDs start from 1 and increase sequentially
    }));

    await writeDataToFile(items); // Save the updated data to data.json
    res.status(200).json({  updatedItems: items });
  } catch (err) {
    console.error('Error deleting item:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
