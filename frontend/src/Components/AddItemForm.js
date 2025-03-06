import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const AddItemForm = ({ open, handleClose, handleAddItem }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields
  const validate = () => {
    let tempErrors = {};
    tempErrors.name = formData.name ? "" : "Name is required.";
    tempErrors.category = formData.category ? "" : "Category is required.";
    tempErrors.quantity =
      formData.quantity && !isNaN(formData.quantity)
        ? ""
        : "Quantity must be a number.";

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validate()) {
      
      // Retrieve existing data from local storage
      const existingData = JSON.parse(localStorage.getItem("inventoryData")) || [];

      // Generate a unique ID
      const newId = existingData.length > 0 ? existingData[existingData.length - 1].id + 1 : 1;

      // Create a new item
      const newItem = { ...formData, id: newId, quantity: Number(formData.quantity) };

      // Update local storage
      const updatedData = [...existingData, newItem];
      localStorage.setItem("inventoryData", JSON.stringify(updatedData));

      // Update parent state (fixes missing UI update)
      handleAddItem(newItem);
      
      handleClose();
      // Reset form
      setFormData({ name: "", category: "", quantity: "" }); 
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="dense"
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          fullWidth
          margin="dense"
          error={!!errors.category}
          helperText={errors.category}
        />
        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          value={formData.quantity}
          onChange={handleChange}
          fullWidth
          margin="dense"
          error={!!errors.quantity}
          helperText={errors.quantity}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemForm;
