import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672';

let channel: amqp.Channel;

export const connectMessageBus = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('✅ Connected to RabbitMQ');
    
    // Ensure exchange exists for config updates
    await channel.assertExchange('config.updates', 'fanout', { durable: true });
  } catch (error) {
    console.error('❌ Failed to connect to RabbitMQ', error);
  }
};

export const publishConfigUpdatedEvent = async (configType: string, payload: any) => {
  if (!channel) {
    console.warn('RabbitMQ channel not established, event not published');
    return;
  }
  
  const event = {
    eventType: 'ConfigUpdatedEvent',
    configType,
    payload,
    timestamp: new Date().toISOString()
  };

  channel.publish(
    'config.updates',
    '', // routing key ignored for fanout
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
  
  console.log(`Event published: ConfigUpdatedEvent [${configType}]`);
};
