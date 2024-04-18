import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { TextField, Button, Typography, Grid } from "@material-ui/core";

interface GroceryItem {
  itemName: string;
  productId: string;
  tags: string;
  price: string;
  discount: string;
  description: string;
  images: FileList | null;
}

interface Props {
  initialItem?: GroceryItem;
}

const GroceryItemForm: React.FC<Props> = ({ initialItem }) => {
  const classes = useStyles();
  const [itemName, setItemName] = useState("");
  const [productId, setProductId] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  useEffect(() => {
    if (initialItem) {
      setItemName(initialItem.itemName);
      setProductId(initialItem.productId);
      setTags(initialItem.tags);
      setPrice(initialItem.price);
      setDiscount(initialItem.discount);
      setDescription(initialItem.description);
      setImages(initialItem.images);
    }
  }, [initialItem]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // You can perform further actions like sending data to backend
    console.log("Form submitted:", {
      itemName,
      productId,
      tags,
      price,
      discount,
      description,
      images,
    });
    // Reset form fields after submission
    resetForm();
  };

  const resetForm = () => {
    setItemName("");
    setProductId("");
    setTags("");
    setPrice("");
    setDiscount("");
    setDescription("");
    setImages(null);
  };

  return (
    <div className={classes.root}>
      <Typography variant="h5" gutterBottom>
        {initialItem ? "Edit Grocery Item Details" : "Add Grocery Item Details"}
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Product ID"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags (Comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              fullWidth
              label="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className={classes.input}
              multiple
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {initialItem ? "Save Changes" : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    input: {
      display: "block",
    },
  })
);

export default GroceryItemForm;
