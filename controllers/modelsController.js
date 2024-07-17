// controllers/modelsController.js  
const { Model } = require('../models');  
const { sendToQueue } = require('../utils/rabbitmq');  
const { MODEL_VALIDATION_QUEUE } = require('../jobs/queues');  
  
class ModelsController {  
  async getModels(req, res) {  
    try {  
      const models = await Model.find({ hidden: false, status: 3 }).exec();  
        
      // Transform the models to change _id to id  
      const transformedModels = models.map(model => {  
        const transformedModel = model.toObject(); // Convert Mongoose document to plain JavaScript object  
        transformedModel.id = transformedModel._id; // Add new id field  
        delete transformedModel._id; // Remove the _id field  
        return transformedModel;  
      });  
        
      res.json(transformedModels);  
    } catch (error) {  
      res.status(500).json({ error: error.message });  
    }  
  }  
  
  
  async addModel(req, res) {  
    const { password, public_name, real_name } = req.body;  
    if (password !== 'SONAEMC-TEST') {  
      return res.status(401).json({ status: false, msg: 'Not allowed' });  
    }  
  
    try {  
      const newModel = await Model.create({ public_name, real_name });  
      await sendToQueue(MODEL_VALIDATION_QUEUE, { modelId: newModel._id });  
      console.log(`Model added to queue: ${newModel._id}`);  
      res.json({ status: true, msg: 'Model queued for download.' });  
    } catch (error) {  
      res.status(400).json({ error: error.message });  
    }  
  }  
}  
  
module.exports = new ModelsController();  
