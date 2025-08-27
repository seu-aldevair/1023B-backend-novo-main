import express from 'express'
import mysql from 'mysql2/promise'
import 'dotenv/config'

const app = express()

app.get('/', async (req, res) => {
    try {
        if (process.env.DBHOST === undefined) {
            res.status(500).send("DBHOST is not defined")
            return
        }
        if (process.env.DBUSER === undefined) {
            res.status(500).send("DBUSER is not defined")
            return
        }
        if (process.env.DBPASSWORD === undefined) {
            res.status(500).send("DBPASSWORD is not defined")
            return
        }
        if (process.env.DBDATABASE === undefined) {
            res.status(500).send("DBDATABASE is not defined")
            return
        }

        const conn = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE,
            port: Number(process.env.DBPORT)
        })
        res.send(process.env.DBHOST)
        await conn.end()
    } catch (err) {
        if (err instanceof Error === false) {
            res.status(500).send("Erro desconhecido ao conectar ao banco de dados")
            return
        }
        const error = err as Error
        res.status(500).send("Erro ao conectar ao banco de dados: " + error.message)
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})