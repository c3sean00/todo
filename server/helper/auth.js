import jwt from 'jsonwebtoken'

console.log('JWT_SECRET_KEY:', process.env.JWT_SECRET_KEY)



const auth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' })
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' })
    }
    req.user = decoded
    next()
  })
}

export { auth }