import express, { Request, Response } from 'express'
import 'dotenv/config'
import { MongoClient } from 'mongodb'

(async () => {
    const client = new MongoClient(process.env.MONGO_URI!)
    await client.connect()
    const db = client.db(process.env.MONGO_DB!)

    const app = express()

    app.use(express.json()) // Middleware para parsear JSON
    app.get('/', async (req: Request, res: Response) => {
        const produtos = await db.collection('produtos').find().toArray()
        res.json(produtos)

    })

    app.listen(8000, () => {
        console.log('Server is running on port 8000')
    })
})()

