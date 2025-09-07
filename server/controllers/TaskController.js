import { selectAllTasks, insertTask, deleteTask } from '../models/Task.js';
import { ApiError } from '../helper/ApiError.js';

 // Lisää deleteTask import

export const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks();
    return res.status(200).json(result.rows || []);
  } catch (error) {
    return next(error);
  }
};

export const postTask = async (req, res, next) => {
  const { task } = req.body;
  console.log("Task to create:", task);
  try {
    if (!task || !task.description || task.description.trim().length === 0) {
      return next(new ApiError('Task description is required', 400));
    }
    const result = await insertTask(task.description);
    return res.status(201).json({ id: result.id, description: result.description });
  } catch (error) {
    return next(error);
  }
};

// Uusi deleteTaskById-funktio
export const deleteTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const rowCount = await deleteTask(id); // Kutsuu deleteTask-funktiota models-kansiosta
    if (rowCount === 0) {
      return next(new ApiError('Task not found', 404));
    }
    res.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
};