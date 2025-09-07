import { pool } from '../helper/db.js'

export const selectAllTasks = async () => {
  return await pool.query('SELECT * FROM task')
}

export const insertTask = async (description) => {
  const result = await pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [description]
  )
  return result.rows[0]
}

export const deleteTask = async (id) => {
  const result = await pool.query('DELETE FROM task WHERE id = $1', [id])
  return result.rowCount
}