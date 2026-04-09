const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
