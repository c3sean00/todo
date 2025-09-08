import { useEffect, useState } from "react"
import { useUser } from "../context/useUser"
import axios from "axios"
import Row from "../components/Row"

const url = import.meta.env.VITE_API_URL

export default function App() {
  const [task, setTask] = useState("")
  const [tasks, setTasks] = useState([])
  const { user } = useUser()

  const getHeaders = () => ({ headers: { Authorization: `Bearer ${user.token}` } })

  const addTask = () => {
    const newTask = { description: task }
    axios.post(`${url}/create`, { task: newTask }, getHeaders())
      .then(response => {
        setTasks([...tasks, response.data])
        setTask("")
      })
      .catch(error => console.error("Error creating task:", error.message))
  }

  const deleteTask = deleted => {
    axios.delete(`${url}/delete/${deleted}`, getHeaders())
      .then(() => setTasks(tasks.filter(item => item.id !== deleted)))
      .catch(error => console.error("Error deleting task:", error.message))
  }

  useEffect(() => {
    axios.get(`${url}/tasks`, getHeaders())
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error.message))
  }, [])

  return (
    <div>
      <input value={task} onChange={e => setTask(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(task => (
          <Row key={task.id} task={task} onDelete={() => deleteTask(task.id)} />
        ))}
      </ul>
    </div>
  )
}