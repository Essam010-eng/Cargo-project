const axios = require('axios');
const Product = require("../models/products"); 
const Review = require("../models/reviwe"); 

const BASE_URL = 'https://abdoelhadray-recommendation-system.hf.space/recommend';


exports.getRecommendationByContent = async (req, res) => {
    try {
        const { itemName } = req.query;

        if (!itemName) {
            return res.status(400).json({ 
                success: false, 
                message: "برجاء إرسال اسم المنتج في الـ Query Parameter باسم itemName" 
            });
        }

        let recommendedNames = [];

        try {
            const aiResponse = await axios.get(`${BASE_URL}/content-based`, {
                params: { item_name: itemName },
                timeout: 3000
            });
            recommendedNames = aiResponse.data;
        } catch (aiError) {
            console.warn("تنبيه: سيرفر الـ AI متوقف في Content-Based:", aiError.message);
        }

        let products;

    
        if (recommendedNames && recommendedNames.length > 0) {
            products = await Product.find({ name: { $in: recommendedNames } }).lean();
            products.sort((a, b) => recommendedNames.indexOf(a.name) - recommendedNames.indexOf(b.name));
        } else {

            products = await Product.find({}).limit(10).lean();
        }

        return res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.error("Content-Based Critical Error:", error.message);
        return res.status(500).json({ success: false, message: "حدث خطأ داخلي غير متوقع في السيرفر" });
    }
};

exports.getTrendingRecommendations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        let trendingNames = [];

        try {
            const aiResponse = await axios.get(`${BASE_URL}/trending`, {
                params: { top_n: limit },
                timeout: 3000
            });

            // تحويل مصفوفة الـ Objects إلى مصفوفة Strings صريحة
            if (aiResponse.data && Array.isArray(aiResponse.data)) {
                trendingNames = aiResponse.data.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return item.Name || item.name;
                    }
                    return item;
                }).filter(Boolean);
            }
        } catch (aiError) {
            console.warn("تنبيه: سيرفر الـ AI متوقف في Trending:", aiError.message);
        }

        let products = [];

        if (trendingNames && trendingNames.length > 0) {
            products = await Product.find({ name: { $in: trendingNames } }).lean();

            if (products.length > 0) {
                // ترتيب آمن لا يسبب كراش حتى لو اختلف حالة الأحرف
                products.sort((a, b) => {
                    const indexA = trendingNames.findIndex(name => name.toLowerCase() === a.name.toLowerCase());
                    const indexB = trendingNames.findIndex(name => name.toLowerCase() === b.name.toLowerCase());
                    return indexA - indexB;
                });
            }
        }

        // ✅ Fallback على الداتابيز: لو الـ AI متوقف، أو رجع أسماء، لكن مفيش ولا واحدة منها
        // موجودة فعلياً في الداتابيز (مثلاً الموديل مدرب على داتاسيت تجريبي مختلف عن منتجاتنا الحقيقية)
        if (products.length === 0) {
            products = await Product.find({})
                .sort({ averageRating: -1 })
                .limit(limit)
                .lean();
        }

        if (!products || products.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        const productIds = products.map(p => p._id);
        const allReviews = await Review.find({ product: { $in: productIds } });

        for (let product of products) {
            const reviews = allReviews.filter(r => r.product && r.product.toString() === product._id.toString());

            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
                product.liveAverageRating = Number((totalRating / reviews.length).toFixed(1));
                product.totalReviewsCount = reviews.length;
            } else {
                product.liveAverageRating = product.averageRating || 0;
                product.totalReviewsCount = 0;
            }
        }

        // الترتيب النهائي حسب التقييم الحي
        products.sort((a, b) => (b.liveAverageRating || 0) - (a.liveAverageRating || 0));

        return res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.error("Trending Critical Error Details:", error);
        return res.status(500).json({ success: false, message: "حدث خطأ داخلي غير متوقع في السيرفر" });
    }
};

exports.getCollaborativeRecommendations = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "برجاء إرسال رقم تعريف المستخدم في الـ Query Parameter باسم userId"
            });
        }

        let recommendedNames = [];

        try {
            const aiResponse = await axios.get(`${BASE_URL}/collaborative`, {
                params: { user_id: userId },
                timeout: 3000
            });

            // ✅ نفس معالجة الـ trending: تحويل الـ objects لـ strings صريحة
            if (aiResponse.data && Array.isArray(aiResponse.data)) {
                recommendedNames = aiResponse.data.map(item => {
                    if (typeof item === 'object' && item !== null) {
                        return item.Name || item.name;
                    }
                    return item;
                }).filter(Boolean);
            }
        } catch (aiError) {
            console.warn("تنبيه: سيرفر الـ AI متوقف في Collaborative:", aiError.message);
        }

        let products = [];

        if (recommendedNames && recommendedNames.length > 0) {
            products = await Product.find({ name: { $in: recommendedNames } }).lean();
        }

        // Fallback: لو الـ AI متوقف، أو الأسماء الراجعة منه مالها أي تطابق حقيقي في الداتابيز
        if (products.length === 0) {
            products = await Product.find({}).sort({ averageRating: -1 }).limit(6).lean();
        }

        return res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.error("Collaborative Critical Error:", error.message);
        return res.status(500).json({ success: false, message: "حدث خطأ داخلي غير متوقع في السيرفر" });
    }
};