import { Request, Response } from 'express';
import { OperatorModel } from '../models/Operator';
import { SystemConfigModel } from '../models/SystemConfig';
import { publishConfigUpdatedEvent } from '../services/messageBus';

export const getOperators = async (req: Request, res: Response) => {
  try {
    const operators = await OperatorModel.findAll();
    res.json(operators);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operators' });
  }
};

export const createOperator = async (req: Request, res: Response) => {
  try {
    const { name, code, status } = req.body;
    const operator = await OperatorModel.create({ name, code, status });
    res.status(201).json(operator);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create operator' });
  }
};

export const updateOperator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, status } = req.body;
    const operator = await OperatorModel.update(parseInt(id), { name, code, status });
    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' });
    }
    res.json(operator);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update operator' });
  }
};

export const deleteOperator = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await OperatorModel.destroy(parseInt(id));
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Operator not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete operator' });
  }
};

export const updateCommissions = async (req: Request, res: Response) => {
  try {
    const rates = req.body;
    const config = await SystemConfigModel.upsert('commission_rates', rates);
    await publishConfigUpdatedEvent('COMMISSIONS', rates);
    res.json({ message: 'Commissions updated successfully', config });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update commissions' });
  }
};

export const updateLimits = async (req: Request, res: Response) => {
  try {
    const limits = req.body;
    const config = await SystemConfigModel.upsert('global_limits', limits);
    await publishConfigUpdatedEvent('LIMITS', limits);
    res.json({ message: 'Limits updated successfully', config });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update limits' });
  }
};
