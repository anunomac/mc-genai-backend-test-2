const { Model, ClassificationRequest, GenericErrorLog } = require('../models');  
const { createSentimentNode } = require('../utils');  
  
async function validateAndDownloadModel({ modelId }) {  
  console.log(`Validating and downloading model: ${modelId}`);  
  let model;  
  try {  
    model = await Model.findById(modelId).exec();  
    model.status = 2; // Downloading  
    await model.save();  
  
    const sentimentNode = await createSentimentNode(model.real_name);  
    await sentimentNode('Test'); // Test the model with a dummy input  
    model.status = 3; // Ready  
    await model.save();  
    console.log(`Model validation completed: ${modelId}`);  
  } catch (error) {  
    if (model) {  
      model.status = 0; // Failed  
      await model.save();  
    }  
    await logException(error, 'validateAndDownloadModel');  
    console.error(`Model validation failed: ${modelId}`, error);  
  }  
}  
  
async function processClassificationRequest({ requestId }) {  
  console.log(`Processing classification request: ${requestId}`);  
  const classificationRequest = await ClassificationRequest.findById(requestId).exec();  
  try {  
    classificationRequest.status = 2; // Processing  
    await classificationRequest.save();  
  
    const target_model = await Model.findById(classificationRequest.target_model).exec();  
    const sentimentNode = await createSentimentNode(target_model.real_name);  
    const result = await sentimentNode(classificationRequest.user_message);  
    const sentimentLabel = result[0].label;  
    const sentimentScore = result[0].score;  
  
    classificationRequest.model_classification = sentimentLabel;  
    classificationRequest.model_classification_score = sentimentScore;  
    classificationRequest.status = 3; // Complete  
    await classificationRequest.save();  
    console.log(`Classification request completed: ${requestId}`);  
  } catch (error) {  
    await logException(error, 'processClassificationRequest');  
    classificationRequest.status = 0; // Failed  
    await classificationRequest.save();  
    console.error(`Classification request failed: ${requestId}`, error);  
  }  
}  
  
async function logException(error, source) {  
  await GenericErrorLog.create({  
    exception: error.message,  
    traceback: error.stack,  
    source,  
  });  
}  
  
module.exports = { processClassificationRequest, validateAndDownloadModel };  
