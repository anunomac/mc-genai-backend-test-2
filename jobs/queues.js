const { createQueue, consumeQueue } = require('../utils/rabbitmq');  
const { processClassificationRequest, validateAndDownloadModel } = require('./workers');  
  
const CLASSIFICATION_QUEUE = 'classificationQueue';  
const MODEL_VALIDATION_QUEUE = 'modelValidationQueue';  
  
async function setupQueues() {  
  await createQueue(CLASSIFICATION_QUEUE);  
  await createQueue(MODEL_VALIDATION_QUEUE);  
  
  consumeQueue(CLASSIFICATION_QUEUE, processClassificationRequest);  
  consumeQueue(MODEL_VALIDATION_QUEUE, validateAndDownloadModel);  
  console.log("Queues are set up and consuming");  
}  
  
module.exports = { setupQueues, CLASSIFICATION_QUEUE, MODEL_VALIDATION_QUEUE };  
