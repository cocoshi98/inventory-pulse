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
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddItemForm from "./AddItemForm";
import axios from "axios"; // Import axios for making API requests

const InventoryTable = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkMode")) || false
  );

  // Fetch data from the backend API
  useEffect(() => {
    axios.get("http://localhost:5000/api/items")
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // // Function to update data locally after an API call
  // const updateData = (newData) => {
  //   setData(newData);
  // };

   // Toggle dark mode and save preference
   const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Define themes
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });
  
  // Function to update local storage whenever data changes
  // const updateLocalStorage = (newData) => {
  //   localStorage.setItem("inventoryData", JSON.stringify(newData));
  // };
  
  // Add new item to the table
  const handleAddItem = (newItem) => {
    axios.post("http://localhost:5000/api/items", newItem)
      .then((response) => {
        setData((prevData) => [...prevData, response.data]);
      })
      .catch((error) => console.error("Error adding item:", error));
  };
  
  // Delete item from the table
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/items/${id}`)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };
  
  // Open & close the form
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: "10px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDarkMode}
          style={{ marginBottom: "10px", marginRight: "10px" }}
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </Button>

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
    </ThemeProvider>
  );
};

export default InventoryTable;
