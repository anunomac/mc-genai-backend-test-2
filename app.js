// app.js  
const express = require('express');  
var cors = require('cors')
const bodyParser = require('body-parser');  
const routes = require('./routes');  
const errorHandler = require('./middleware/errorHandler');  
const mongoose = require('mongoose');  
const { setupQueues } = require('./jobs/queues');  
  
const app = express();  
app.use(cors())
const PORT = 8000;  
  
// MongoDB connection  
mongoose.connect('mongodb://localhost:27017/sentiment_analysis', {  
  // useNewUrlParser: true,  
  // useUnifiedTopology: true,  
}).then(() => {  
  console.log('Connected to MongoDB');  
}).catch((err) => {  
  console.error('MongoDB connection error:', err);  
});  
  
// Middleware  
app.use(bodyParser.json());  
app.use('/api', routes);  
app.use(errorHandler);  
  
// Set up queues  
setupQueues().then(() => {  
  console.log('Queues are set up and consuming');  
}).catch((err) => {  
  console.error('Error setting up queues:', err);  
});  
  
// Start the server  
app.listen(PORT, () => {  
  console.log(`Server is running on port ${PORT}`);  
});  
