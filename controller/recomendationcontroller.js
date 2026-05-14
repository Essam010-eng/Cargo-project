const axios = require('axios');
const Product = require("../models/products"); // تأكد أن مسار موديل الـ Product عندك صحيح هنا
const Review = require("../models/reviwe");   // تأكد أن مسار موديل الـ Review عندك صحيح هنا

const BASE_URL = 'https://abdoelhadray-recommendation-system.hf.space/recommend';

// 1️⃣ نظام التوصيات بناءً على المحتوى (Content-Based)
// الرابط: /api/recommend/content?itemName=اسم_المنتج
exports.getRecommendationByContent = async (req, res) => {
    try {
        const { itemName } = req.query;

        if (!itemName) {
            return res.status(400).json({ 
                success: false, 
                message: "برجاء إرسال اسم المنتج في الـ Query Parameter باسم itemName" 
            });
        }

        // أ. إرسال طلب للـ AI لمعرفة أسماء المنتجات المرشحة
        const aiResponse = await axios.get(`${BASE_URL}/content-based`, {
            params: { item_name: itemName } // الـ AI يتوقع مفتاح باسم item_name
        });

        const recommendedNames = aiResponse.data; 

        if (!recommendedNames || recommendedNames.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // ب. البحث في قاعدة بياناتك بالأسماء الموصى بها
        // استخدمنا حقل "name" المطابق تماماً للـ Schema عندك
        const products = await Product.find({
            name: { $in: recommendedNames }
        });

        return res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.error("Content-Based Error:", error.message);
        return res.status(500).json({ success: false, message: "حدث خطأ في جلب التوصيات بالمحتوى" });
    }
};

// 2️⃣ نظام المنتجات الأكثر تقييماً (Trending)
// الرابط: /api/recommend/trending?limit=10
exports.getTrendingRecommendations = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // أ. جلب قائمة الأسماء "التريند" من الـ AI
        const aiResponse = await axios.get(`${BASE_URL}/trending`, {
            params: { top_n: limit } // الـ AI يتوقع مفتاح باسم top_n
        });

        const trendingNames = aiResponse.data;

        // ب. جلب هذه المنتجات من قاعدة البيانات عندك
        // استخدمنا الـ .lean() عشان نقدر نعدل في الـ JSON ونضيف عليه بيانات التقييم الحي
        let products = await Product.find({
            name: { $in: trendingNames }
        }).lean();

        // ج. حساب التقييمات الحية لكل منتج من موديل الـ Review عندك
        for (let product of products) {
            // بنجيب كل الريفيوهات للمنتج الحالي باستخدام الـ _id وحقل الـ product في الـ Review Schema
            const reviews = await Review.find({ product: product._id });
            
            if (reviews.length > 0) {
                // حساب مجموع الـ ratings (المفتاح اسمه rating في الـ Review Schema عندك)
                const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
                product.liveAverageRating = Number((totalRating / reviews.length).toFixed(1));
                product.totalReviewsCount = reviews.length;
            } else {
                // لو مفيش ريفيوهات، نعتمد على الـ averageRating المتخزن في موديل الـ Product عندك (الافتراضي 0)
                product.liveAverageRating = product.averageRating || 0;
                product.totalReviewsCount = 0;
            }
        }

        // د. ترتيب المنتجات تنازلياً من الأعلى للـ liveAverageRating للأقل
        products.sort((a, b) => b.liveAverageRating - a.liveAverageRating);

        return res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.error("Trending Error:", error.message);
        return res.status(500).json({ success: false, message: "حدث خطأ في جلب المنتجات الأكثر تقييماً" });
    }
};

// 3️⃣ نظام التوصيات للمستخدم (Collaborative)
// الرابط: /api/recommend/user?userId=1
exports.getCollaborativeRecommendations = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "برجاء إرسال رقم تعريف المستخدم في الـ Query Parameter باسم userId" 
            });
        }

        // أ. إرسال الـ userId للـ AI لمعرفة الترشيحات المخصصة له
        const aiResponse = await axios.get(`${BASE_URL}/collaborative`, {
            params: { user_id: userId } // الـ AI يتوقع مفتاح باسم user_id
        });

        const recommendedNames = aiResponse.data;

        // ب. التعامل مع حالة "المستخدم الجديد" (Cold Start)
        // لو الـ AI مرجعش أي منتجات مرشحة، بنجيب له منتجات تانية تريند كـ fallback عشان الشاشة متظهرش فاضية
        if (!recommendedNames || recommendedNames.length === 0) {
            const fallbackAiResponse = await axios.get(`${BASE_URL}/trending`, { params: { top_n: 6 } });
            const fallbackProducts = await Product.find({ name: { $in: fallbackAiResponse.data } });
            
            return res.status(200).json({ 
                success: true, 
                message: "تم عرض المنتجات الأكثر تقييماً لعدم وجود تقييمات كافية للمستخدم حتى الآن", 
                data: fallbackProducts 
            });
        }

        // ج. لو المستخدم قديم وعنده ترشيحات، بنجيب بيانات المنتجات دي كاملة من قاعدة البيانات عندك
        const products = await Product.find({
            name: { $in: recommendedNames }
        });

        return res.status(200).json({ success: true, data: products });

    } catch (error) {
        console.error("Collaborative Error:", error.message);
        return res.status(500).json({ success: false, message: "حدث خطأ في جلب توصيات المستخدم" });
    }
};