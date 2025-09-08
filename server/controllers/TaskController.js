import { selectAllTasks, insertTask, deleteTask } from '../models/Task.js'
import { ApiError } from '../helper/ApiError.js'

export const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks()
    res.status(200).json(result.rows || [])
  } catch (error) {
    next(error)
  }
}

export const postTask = async (req, res, next) => {
  const { task } = req.body
  if (!task?.description?.trim()) {
    return next(new ApiError('Task description is required', 400))
  }

  try {
    const result = await insertTask(task.description)
    res.status(201).json({ id: result.id, description: result.description })
  } catch (error) {
    next(error)
  }
}

export const deleteTaskById = async (req, res, next) => {
  const { id } = req.params

  try {
    const rowCount = await deleteTask(id)
    if (!rowCount) {
      return next(new ApiError('Task not found', 404))
    }
    res.status(200).json({ id })
  } catch (error) {
    next(error)
  }
}