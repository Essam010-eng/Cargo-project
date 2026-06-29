const axios = require('axios');
const FormData = require('form-data');
const Product = require('../models/products'); // مسار موديل المنتج عندك

const generateAiIntegration = async (req, res) => {
    try {
        const { productId } = req.body;
        const carImageFile = req.file; 

        if (!carImageFile) {
            return res.status(400).json({ message: 'صورة السيارة الأصلية مطلوبة (car_image)' });
        }

        if (!productId) {
            return res.status(400).json({ message: 'حقل productId مطلوب في الـ body' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'المنتج غير موجود في قاعدة البيانات' });
        }

        if (!product.colorimage || !product.colorimage[0] || !product.colorimage[0].images || product.colorimage[0].images.length === 0) {
            return res.status(400).json({ 
                message: 'هيكل صور المنتج غير متطابق أو مصفوفة الصور فارغة داخل colorimage' 
            });
        }

        const productImageUrl = product.colorimage[0].images[0]; 
        const productName = product.name; 

        const formData = new FormData();
        
        if (productName) {
            formData.append('product_name', productName);
        }

        formData.append('car_image', carImageFile.buffer, {
            filename: carImageFile.originalname,
            contentType: carImageFile.mimetype,
        });

        const responseImage = await axios.get(productImageUrl, { responseType: 'stream' });
        formData.append('product_image', responseImage.data, {
            filename: `product_${productId}.jpg`, 
        });

        const aiUrl = 'https://abdoellithy-somnium.hf.space/generate-integration/';
        
        const aiResponse = await axios.post(aiUrl, formData, {
            headers: {
                ...formData.getHeaders(), 
            },
        });

        return res.status(200).json({
            success: true,
            data: aiResponse.data, 
        });

    } catch (error) {
        console.error('AI Integration Error:', error.message);
        return res.status(500).json({
            message: 'حصلت مشكلة أثناء الربط مع الـ AI',
            error: error.message,
        });
    }
};

module.exports = {
    generateAiIntegration,
};