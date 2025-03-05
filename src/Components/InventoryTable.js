import React, { useState } from "react";
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
import inventoryData from "../Data";

const InventoryTable = () => {
  const [data, setData] = useState(inventoryData);
  const [open, setOpen] = useState(false);

  // Open & close the form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add new item to the table
  const handleAddItem = (newItem) => {
    const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
    const updatedItem = { ...newItem, id: newId };

    setData([...data, updatedItem]);
  };

  // Delete item from the table
  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
  };

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
