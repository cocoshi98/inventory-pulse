import React, { useState, useEffect} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import AddItemForm from "./AddItemForm";

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  // Load data from local storage when component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("inventoryData"));
    if (savedData) {
      setData(savedData);
    }
  }, []);
  
  // Function to update local storage whenever data changes
  const updateLocalStorage = (newData) => {
    localStorage.setItem("inventoryData", JSON.stringify(newData));
  };
  
  // Add new item to the table
  const handleAddItem = (newItem) => {
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    const updatedItem = { ...newItem, id: newId };
    const newData = [...data, updatedItem];
    
    setData(newData);
    updateLocalStorage(newData); // Save to local storage
  };
  
  // Delete item from the table
  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    updateLocalStorage(updatedData); // Save to local storage
  };
  
  // Open & close the form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        style={{ marginBottom: "10px" }}
      >
        Add Item
      </Button>

      <AddItemForm
        open={open}
        handleClose={handleClose}
        handleAddItem={handleAddItem}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InventoryTable;
