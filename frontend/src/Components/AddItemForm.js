import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios"; // Import axios for making API requests

// Form for adding items
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
    // Checks if there are any errors found
    return Object.values(tempErrors).every((x) => x === "");
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validate()) {
      // Create a new item
      const newItem = { ...formData, quantity: Number(formData.quantity) };
  
      // Send new item to backend API
      axios.post("http://localhost:10000/api/items", newItem)
        .then((response) => {
          // Update parent state with the new item (fixes missing UI update)
          handleAddItem(response.data);  // Assuming the response contains the new item
          handleClose();
          
          // Reset form
          setFormData({ name: "", category: "", quantity: "" });
        })
        .catch((error) => console.error("Error adding item:", error));
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
