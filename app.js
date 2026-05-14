const express = require("express");
const app = express();
require("dotenv").config();
const dbConnection = require("./config/dbconnection");
const productRouter = require("./routes/productrouter");
const authRouter = require("./routes/authrouter");
const AppError = require("./helpers/globalerrorehandler");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));
const orderrouter = require("./routes/orderrouter");
const userrouter = require("./routes/userrouter");
const reviewrouter = require("./routes/reviewrouter");
const cardamagerouter = require("./routes/cardamagerouter");
const recomendationrouter = require("./routes/recomendationrouter");


app.use("/api/auth", authRouter);

app.use("/api/product", productRouter);

app.use("/api/order" , orderrouter);

app.use("/api/user" , userrouter);

app.use("/api/review" , reviewrouter);

app.use("/api" ,cardamagerouter);

app.use("/api" , recomendationrouter);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: "errore",
        message: err.message
    });
});


app.listen(process.env.port, (port) => {
    try{
        console.log(`Server running on port ${process.env.port}`);
    }
    catch (err) {
        console.error("Failed to start server:", err);
    }
});

dbConnection();
