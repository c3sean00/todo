import { expect } from 'chai'
import { initializeTestDb, insertTestUser, getToken } from './helper/test.js'



describe("Testing basic database functionality", () => {
  let token = null;
  const testUser = { email: "foo@foo.com", password: "password123" }

  before(async () => {
    await initializeTestDb();
    await insertTestUser(testUser)
    token = getToken(testUser.email)
  })

   
describe("Testing user management", () => { 
it("should sign up", async () => {
  const newUser = { email: `unique${Date.now()}@test.com`, password: "password123" }
  const response = await fetch("http://localhost:3001/user/signup", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: newUser }),
  })

  const data = await response.json()
  console.log('Response body:', data)
  expect(response.status).to.equal(201)
  expect(data).to.include.all.keys(["id", "email"])
  expect(data.email).to.equal(newUser.email)
})
})

  it("should get all tasks", async () => {
    const response = await fetch("http://localhost:3001/")
    const data = await response.json()
    expect(response.status).to.equal(200)
    expect(data).to.be.an("array").that.is.not.empty
    expect(data[0]).to.include.all.keys(["id", "description"])
  })

  it("should create a new task", async () => {
    const newTask = { description: "Test task" }
    const response = await fetch("http://localhost:3001/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task: newTask }),
    })
    const data = await response.json()
    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys(["id", "description"])
    expect(data.description).to.equal(newTask.description)
  })

it("should not create a new task without description", async () => {
  const response = await fetch("http://localhost:3001/create", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ task: null }), 
  })

  const data = await response.json()
  expect(response.status).to.equal(400)
  expect(data).to.include.all.keys(["error"])
  expect(data.error).to.equal("Task is required")
})


it("should delete task", async () => {
  
  const newTask = { description: "Task to be deleted" }
  const createResponse = await fetch("http://localhost:3001/create", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ task: newTask }),
  })
  const createdTask = await createResponse.json()

  
  const response = await fetch(`http://localhost:3001/delete/${createdTask.id}`, {
    method: "delete",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  const data = await response.json()

  expect(response.status).to.equal(200)
  expect(data).to.include.all.keys(["id"])
  expect(parseInt(data.id)).to.equal(createdTask.id)
})
})