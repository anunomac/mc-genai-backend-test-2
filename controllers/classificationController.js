// controllers/classificationController.js  
const { ClassificationRequest, Model } = require('../models');  
const { sendToQueue } = require('../utils/rabbitmq');  
const { CLASSIFICATION_QUEUE } = require('../jobs/queues');  
  
class ClassificationController {  
  async getClassification(req, res) {  
    const { cid, access_key } = req.query;  
    try {  
      const classificationRequest = await ClassificationRequest.findOne({  
        _id: cid,  
        secretKey: access_key,  
      }).exec();  
  
      if (!classificationRequest) {  
        return res.status(404).json({ status: false, msg: 'Classification request not found' });  
      }  
      const model_used = await Model.findOne({  
        _id: classificationRequest.target_model,  
      }).exec();
      // console.log(model_used);
      classificationRequest.target_model=model_used
      res.json(classificationRequest);  
    } catch (error) {  
      res.status(500).json({ error: error.message });  
    }  
  }  
  
  async postClassification(req, res) {  
    const { query, model: modelId } = req.body;  
    try {  
      const model = await Model.findById(modelId).exec();  
      if (!model) {  
        return res.status(404).json({ status: false, msg: 'Model not found' });  
      }  
  
      const classificationRequest = await ClassificationRequest.create({  
        user_message: query,  
        target_model: model._id,  
      });  
  
      await sendToQueue(CLASSIFICATION_QUEUE, { requestId: classificationRequest._id });  
      res.status(201).json({  
        status: true,  
        msg: 'Classification started',  
        class_id: classificationRequest._id,  
        access_key: classificationRequest.secretKey,  
      });  
    } catch (error) {  
      res.status(400).json({ error: error.message });  
    }  
  }  
}  
  
module.exports = new ClassificationController();  
