async function createSentimentNode(modelName) {  
    const { pipeline } = await import('@xenova/transformers');
    try {  
      const sentimentAnalysis = await pipeline('sentiment-analysis', modelName);  
      console.log("Model successfully fetched");  
      return async function (text) {  
        return sentimentAnalysis(text);  
      };  
    } catch (error) {  
      console.log("ERROR FETCHING MODEL: ", error);  
      throw new Error(`Failed to fetch model: ${modelName}`);  
    }  
  }  
    
  module.exports = { createSentimentNode };  
  