const mongoose = require('mongoose');  
const { v4: uuidv4 } = require('uuid');  
const crypto = require('crypto');  
  
mongoose.connect('mongodb://localhost:27017/sentiment_analysis', {  
  // useNewUrlParser: true,  
  // useUnifiedTopology: true,  
});  
  
const modelSchema = new mongoose.Schema({  
  dateAdded: { type: Date, default: Date.now },  
  public_name: { type: String, required: true },  
  real_name: { type: String, required: true },  
  hidden: { type: Boolean, default: false },  
  status: { type: Number, default: 1 },  
});  
  
const classificationRequestSchema = new mongoose.Schema({  
  target_model: { type: mongoose.Schema.Types.ObjectId, ref: 'Model', required: true },  
  user_message: { type: String, required: true },  
  status: { type: Number, default: 1 },  
  model_classification: { type: String, default: null },  
  model_classification_score: { type: Number, default: null },  
  secretKey: {  
    type: String,  
    default: () => `${uuidv4()}-${crypto.randomBytes(16).toString('hex')}`,  
    required: true,  
  },  
});  
  
const errorLogSchema = new mongoose.Schema({  
  source: { type: String, required: true },  
  exception: { type: String, required: true },  
  traceback: { type: String, default: null },  
});  
  
const Model = mongoose.model('Model', modelSchema);  
const ClassificationRequest = mongoose.model('ClassificationRequest', classificationRequestSchema);  
const GenericErrorLog = mongoose.model('GenericErrorLog', errorLogSchema);  
  
module.exports = { Model, ClassificationRequest, GenericErrorLog };  
