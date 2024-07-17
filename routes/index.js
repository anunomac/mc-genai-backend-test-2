const express = require('express');  
const modelsController = require('../controllers/modelsController');  
const classificationController = require('../controllers/classificationController');  
  
const router = express.Router();  
  
router.get('/models', modelsController.getModels);  
router.post('/models', modelsController.addModel);  
  
router.get('/classifications', classificationController.getClassification);  
router.post('/classifications', classificationController.postClassification);  
  
module.exports = router;  
