import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes';
import reportRoutes from './routes/reportRoutes';
import { connectDB } from './config/database';
import { connectMessageBus } from './services/messageBus';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8088;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-report-service' });
});

const startServer = async () => {
  await connectDB();
  await connectMessageBus();
  
  app.listen(PORT, () => {
    console.log(`Admin report service running on port ${PORT}`);
  });
};

startServer();

export default app;
