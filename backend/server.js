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
  // Resolve is for successful operation, reject is for negative operation
  return new Promise((resolve, reject) => {
    // Reads file, utf8 specifies encoding of file (in this case, standard character encoding)
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
      // Error handling
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
    // Mapping and reordering data in a consistent structure
    const orderedData = data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity
  }));
    const jsonData = JSON.stringify(orderedData, null, 2);
    // Writes to data.json file
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
    // Items contain data read from the file
    const items = await readDataFromFile();
    // Sends the data as a JSON response
    res.json(items);
  } catch (err) {
    console.error('Error reading data:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new item
app.post('/api/items', async (req, res) => {
  try {
    // Extracts data from request body
    const newItem = req.body;
    // Reads existing data
    const items = await readDataFromFile();
    // Generates new item's ID
    newItem.id = items.length ? items[items.length - 1].id + 1 : 1;
    // Adds item to list
    items.push(newItem);
    // Save the updated data to data.json
    await writeDataToFile(items); 
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
