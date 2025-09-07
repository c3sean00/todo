import { pool } from '../helper/db.js';
import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { auth } from '../helper/auth.js'
const router = Router();

// Signup-reitti
router.post('/signup', (req, res, next) => {
  const { user } = req.body;

  if (!user || !user.email || !user.password) {
    const error = new Error('Email and password are required');
    return next(error);
  }

bcrypt.hash(user.password, 10, (err, hashedPassword) => {
  if (err) {
    const error = new Error('Error hashing password');
    return next(error);
  }

  pool.query(
    'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
    [user.email, hashedPassword],
    (err, result) => {
      if (err) {
        return next(err);
      }
      res.status(201).json({ id: result.rows[0].id, email: user.email });
    }
  );
});
});

// Signin-reitti
// Signin-reitti
router.post('/signin', (req, res, next) => {
  const { user } = req.body;

  if (!user || !user.email || !user.password) {
    const error = new Error('Email and password are required');
    error.status = 400;
    return next(error);
  }

  pool.query('SELECT * FROM account WHERE email = $1', [user.email], (err, result) => {
    if (err) return next(err);

    if (result.rows.length === 0) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    const dbUser = result.rows[0];

    bcrypt.compare(user.password, dbUser.password, (err, isMatch) => {
      if (err) return next(err);

      if (!isMatch) {
        const error = new Error('Invalid password');
        error.status = 401;
        return next(error);
      }

      const token = jwt.sign({ email: dbUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ id: dbUser.id, email: dbUser.email, token });
    });
  });
});

// Tasks-reitti
router.get('/tasks', auth, (req, res, next) => {
  const tasks = [
    { id: 1, description: "Test task" },
    { id: 2, description: "Another task" },
  ];
  res.status(200).json(tasks);
});

export default router;