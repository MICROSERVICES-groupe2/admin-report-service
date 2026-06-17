import { pool } from '../config/database';

export interface Operator {
  id: number;
  name: string;
  code: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
}

export const OperatorModel = {
  async findAll(): Promise<Operator[]> {
    const result = await pool.query('SELECT * FROM operators ORDER BY id');
    return result.rows;
  },

  async create(data: { name: string; code: string; status?: string }): Promise<Operator> {
    const result = await pool.query(
      `INSERT INTO operators (name, code, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.name, data.code, data.status ?? 'ACTIVE']
    );
    return result.rows[0];
  },

  async findById(id: number): Promise<Operator | null> {
    const result = await pool.query('SELECT * FROM operators WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },

  async update(id: number, data: Partial<{ name: string; code: string; status: string }>): Promise<Operator | null> {
    const result = await pool.query(
      `UPDATE operators
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           status = COALESCE($3, status),
           updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [data.name, data.code, data.status, id]
    );
    return result.rows[0] ?? null;
  },

  async destroy(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM operators WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
