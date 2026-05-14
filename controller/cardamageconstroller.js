const axios = require('axios');
const FormData = require('form-data');

exports.detectDamage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "برجاء رفع صورة السيارة أولاً" });
        }

        const form = new FormData();
        form.append('image', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const aiResponse = await axios.post('https://abdoelhadray-cardamage.hf.space/detect/damage/all', form, {
            headers: { ...form.getHeaders() }
        });

        return res.status(200).json({ success: true, data: aiResponse.data });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "حدث خطأ أثناء المعالجة" });
    }
};