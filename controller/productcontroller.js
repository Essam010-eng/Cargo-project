const Product = require("../models/products");
const Review = require("../models/reviwe");
const user = require("../models/user");
const AppError = require("../helpers/globalerrorehandler");
const { override } = require("joi");
const jwt = require("jsonwebtoken");


const getAllProducts = async (req, res, next) => {
    try {
        const allProducts = await Product.find();

        if (allProducts.length === 0) {
            return next(new AppError(404, "No products found"));
        }

        res.status(200).json(allProducts);
    } catch (err) {
        next(err);
    }
};

const getAllProductsforsearche = async (req, res, next) => {
    try {
        let query = {}; 
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' }; 
        }
        const products = await Product.find(query);
        res.send(products)
    }
    catch(err){
        next(err)
    }
}

const getOneProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne(
            { 
                id 
            });

        if (!product) {
            return next(new AppError(404, "Product doesn't exist"));
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            category,
            price,
            stock,
            carsforproduct,
            color,
            owner
        } = req.body;

        const filePaths = req.files.map(file => file.path);

        const newProduct = await Product.create({
            name,
            description,
            category,
            price,
            stock,
            carsforproduct,
            colorimage: [{
                color,
                images: filePaths
            }],
            owner : req.user.id
        });

        const reviews = await Review.aggregate([
            { $match: { product: newProduct._id } },
            {
                $group: {
                    _id: "$product",
                    avgRating: { $avg: "$rating" }
                }
            }
        ]);

        newProduct.averageRating = reviews[0]?.avgRating || 0;
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};


const updateproductpatch = async (req,res,next) =>{
    try{
        const updateproduct = await Product.findByIdAndUpdate(req.params.id ,req.body , {new : true})
        if(!updateproduct) {
            return next(new AppError(404 , "cant find the product"));
        }   
        res.send(updateproduct);
    }
    catch(err){
        next(err);
    }
}

const updateproductput = async (req,res,next) =>{
    try{
        const updateproduct = await Product.findByIdAndUpdate(req.params.id ,req.body , {new : true , overwrite : true})
        if(!updateproduct) {
            return next(new AppError(404 , "cant find the product"));
        }   
        res.send(updateproduct);
    }
    catch(err){
        next(err);
    }
}

const deleteproduct = async (req,res,next) =>{
    try{
        const updateproduct = await Product.findByIdAndDelete(req.params.id);
        if(!updateproduct) {
            return next(new AppError(404 , "cant find the product"));
        }   
        res.send(updateproduct);
    }
    catch(err){
        next(err);
    }
}

const sellergetallproduct = async (req, res, next) => {
    try {
        const allProducts = await Product.find({owner : req.user.id});

        if (allProducts.length === 0) {
            return next(new AppError(404, "No products found"));
        }

        res.status(200).json(allProducts);
    } catch (err) {
        next(err);
    }
};

const sellergetoneproduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await Product.findOne(
            { 
                _id: id ,
                owner : req.user.id
            });

        if (!product) {
            return next(new AppError(404, "Product doesn't exist"));
        }

        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

const sellerupdatepatch = async (req,res,next) =>{
    try{
        const updateproduct = await Product.findByIdAndUpdate({
            _id :req.params.id,
            owner : req.user.id
        } ,req.body , {new : true})

        if(!updateproduct) {
            return next(new AppError(404 , "cant find the product"));
        }   
        res.send(updateproduct);
    }
    catch(err){
        next(err);
    }
};

const sellerupdateput = async (req,res,next) =>{
    try{
        const updateproduct = await Product.findByIdAndUpdate({
            _id :req.params.id,
            owner : req.user.id
        } ,req.body , {new : true , overwrite : true})
        
        if(!updateproduct) {
            return next(new AppError(404 , "cant find the product"));
        }   
        res.send(updateproduct);
    }
    catch(err){
        next(err);
    }
} ;


const sellerdeleteproduct = async (req,res,next) =>{
    try{
        const updateproduct = await Product.findByIdAndDelete(
            {
            _id : req.params.id,
            owner : req.user.id
        });
        if(!updateproduct) {
            return next(new AppError(404 , "cant find the product"));
        }   
        res.send(updateproduct);
    }
    catch(err){
        next(err);
    }
}


module.exports = {
    getAllProducts,
    getOneProduct,
    createProduct,
    updateproductpatch,
    updateproductput,
    deleteproduct,
    sellergetallproduct,
    sellergetoneproduct,
    sellerupdateput,
    sellerupdatepatch,
    sellerdeleteproduct,
    getAllProductsforsearche
};
