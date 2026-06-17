import { pool } from '../config/database';

export interface SystemConfig {
  key: string;
  value: any;
  created_at?: Date;
  updated_at?: Date;
}

export const SystemConfigModel = {
  async findByKey(key: string): Promise<SystemConfig | null> {
    const result = await pool.query('SELECT * FROM system_configs WHERE key = $1', [key]);
    return result.rows[0] ?? null;
  },

  async upsert(key: string, value: any): Promise<SystemConfig> {
    const result = await pool.query(
      `INSERT INTO system_configs (key, value)
       VALUES ($1, $2)
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
       RETURNING *`,
      [key, JSON.stringify(value)]
    );
    return result.rows[0];
  },
};
