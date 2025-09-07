import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const __dirname = import.meta.dirname

const initializeTestDb = async () => {
  const sql = fs.readFileSync(path.resolve(__dirname, '../db.sql'), 'utf8')
  await pool.query(sql)
  console.log('Test database initialized successfully')
}

const insertTestUser = async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10)
  await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)', [user.email, hashedPassword])
  console.log('Test user inserted successfully')
};

const getToken = (email) => {
  console.log('JWT_SECRET_KEY in getToken:', process.env.JWT_SECRET_KEY)
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })
}


export { initializeTestDb, insertTestUser, getToken }