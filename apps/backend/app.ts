import express from 'express'
import cors from 'cors'


import apiRoutes from './routes'
import {initSocketServer} from "./ws";

const app = express()
const PORT = 3001


app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

app.use('/api', apiRoutes)



const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})

initSocketServer(server)



