const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const products = require('./product');
const register = require("./routes/register");
const login = require("./routes/login");
const stripe = require("./routes/stripe")
const productRoute = require("./routes/products")
const users = require("./routes/users")
const orders = require("./routes/orders")

const app = express()

require("dotenv").config();

app.use(express.json());
app.use(cors());

app.use("/api/register", register)
app.use("/api/login", login)
app.use("/api/stripe", stripe)
app.use("/api/products", productRoute)
app.use("/api/users", users)
app.use("/api/orders", orders)

app.get("/", (req, res) => {
    res.send("Welcome to our PhoneOutlet API ...")
});
app.get("/products", (req, res) => {
    res.send(products)
})

const port = process.env.PORT || 5000
const uri = process.env.DB_URL

app.listen(port, console.log(`Backend Server is running on port ${port}`))
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connection successful..."))
.catch((err) =>console.log("MongoDB connection failed..", err.message))