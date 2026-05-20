const express = require("express");
const app = express();
require("dotenv").config();
const dbConnection = require("./config/dbconnection");
const productRouter = require("./routes/productrouter");
const authRouter = require("./routes/authrouter");
const AppError = require("./helpers/globalerrorehandler");
const swaggerUi = require("swagger-ui-express");
const openapiSpec = require("./config/openapi.json");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"));

const options = {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
    ]
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec, {}, options));

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

app.get("/", (req, res) => {
    res.send("Backend is running 🚀");
});

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
