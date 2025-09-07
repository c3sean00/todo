import { Router } from 'express';
import { getTasks, postTask, deleteTaskById } from '../controllers/TaskController.js';
import { auth } from '../helper/auth.js';

const router = Router();

router.get('/tasks', getTasks);
router.post('/create', auth, postTask);
router.delete('/delete/:id', auth, deleteTaskById);

export default router;