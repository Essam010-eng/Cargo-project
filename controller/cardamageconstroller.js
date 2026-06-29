exports.detectDamage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "برجاء رفع صورة السيارة أولاً" });
        }

        // 🔍 DEBUG: تأكيد إن الملف جاي صح من multer
        console.log("🔍 req.file info:", {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            hasBuffer: !!req.file.buffer
        });

        const form = new FormData();
        form.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const aiResponse = await axios.post('https://abdoelhadray-cardamage.hf.space/detect/damage/all', form, {
            headers: { ...form.getHeaders() },
            timeout: 30000 // 🔍 زودنا التايم اوت لأن موديل الصور بياخد وقت أطول من نص ثانية
        });

        return res.status(200).json({ success: true, data: aiResponse.data });

    } catch (error) {
        // 🔍 DEBUG: طباعة تفاصيل كاملة عن نوع الخطأ
        console.error("🔍 detectDamage Error message:", error.message);
        console.error("🔍 detectDamage Error code:", error.code);
        if (error.response) {
            console.error("🔍 AI server response status:", error.response.status);
            console.error("🔍 AI server response data:", error.response.data);
        }
        return res.status(500).json({ success: false, message: "حدث خطأ أثناء المعالجة" });
    }
};