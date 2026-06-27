const express = require('express');
const router = express.Router();
const recController = require("../controller/recomendationcontroller");

router.get('/recommend/content', recController.getRecommendationByContent);


router.get('/recommend/trending', recController.getTrendingRecommendations);


router.get('/recommend/user', recController.getCollaborativeRecommendations);

module.exports = router;