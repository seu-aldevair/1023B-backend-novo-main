import express from 'express'
import mysql from 'mysql2/promise'
import 'dotenv/config'

const app = express()

// Rota existente para testar a conexão com o banco de dados
app.get('/', async (req, res) => {
    try {
        if (process.env.DBHOST === undefined || process.env.DBUSER === undefined || process.env.DBPASSWORD === undefined || process.env.DBDATABASE === undefined) {
            res.status(500).send("Variáveis de ambiente do banco de dados não estão definidas")
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

// Nova rota para obter todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        if (process.env.DBHOST === undefined || process.env.DBUSER === undefined || process.env.DBPASSWORD === undefined || process.env.DBDATABASE === undefined) {
            res.status(500).send("Variáveis de ambiente do banco de dados não estão definidas")
            return
        }

        const conn = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE,
            port: Number(process.env.DBPORT)
        })

        const [rows] = await conn.query('SELECT * FROM produtos')
        res.status(200).json(rows)

        await conn.end()
    } catch (err) {
        if (err instanceof Error === false) {
            res.status(500).send("Erro desconhecido ao obter os produtos do banco de dados")
            return
        }
        const error = err as Error
        res.status(500).send("Erro ao obter os produtos do banco de dados: " + error.message)
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000')
})