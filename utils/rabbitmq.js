const amqplib = require('amqplib');  
  
let connection = null;  
let channel = null;  
  
async function connect() {  
  if (connection && channel) {  
    return { connection, channel };  
  }  
  try {  
    connection = await amqplib.connect('amqp://localhost');  
    channel = await connection.createChannel();  
    console.log("Connected to RabbitMQ");  
  } catch (error) {  
    console.error("Failed to connect to RabbitMQ", error);  
  }  
  return { connection, channel };  
}  
  
async function createQueue(queueName) {  
  const { channel } = await connect();  
  await channel.assertQueue(queueName, { durable: true });  
  console.log(`Queue ${queueName} created`);  
}  
  
async function sendToQueue(queueName, message) {  
  const { channel } = await connect();  
  await channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });  
  console.log(`Message sent to queue ${queueName}`);  
}  
  
async function consumeQueue(queueName, callback) {  
  const { channel } = await connect();  
  await channel.consume(queueName, async (msg) => {  
    if (msg !== null) {  
      const message = JSON.parse(msg.content.toString());  
      console.log(`Message received from queue ${queueName}`);  
      await callback(message);  
      channel.ack(msg);  
    }  
  });  
  console.log(`Consuming from queue ${queueName}`);  
}  
  
module.exports = { createQueue, sendToQueue, consumeQueue };  
