import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://kong:8000';

export const httpClient = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: 5000,
});

// Interceptor to propagate Trace ID
httpClient.interceptors.request.use((config) => {
  // In a real scenario, extract traceId from incoming request context
  const traceId = 'trace-' + Date.now();
  if (!config.headers['X-Trace-Id']) {
    config.headers['X-Trace-Id'] = traceId;
  }
  return config;
});

export const fetchTransactions = async (filters: any) => {
  try {
    const response = await httpClient.get('/api/v1/transactions', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions', error);
    throw error;
  }
};

export const fetchTransactionStats = async () => {
  try {
    // Assuming transaction-service has a stats endpoint, or we fetch list and aggregate
    const response = await httpClient.get('/api/v1/transactions/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching transaction stats', error);
    throw error;
  }
};

export const fetchLoanStats = async () => {
  try {
    const response = await httpClient.get('/api/v1/loans/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching loan stats', error);
    throw error;
  }
};
