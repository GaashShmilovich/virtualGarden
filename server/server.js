import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'


const app = express()
const port = 3000

const API_KEY = 'KoDj13vnuf4T3Npp32-tlbLXl2iCCpQJ-JMcE8ABE3k'

app.use(cors())

app.get('/api/plants', async (req, res) => {
    try {
        const response = await fetch(`https://trefle.io/api/v1/plants?token=${API_KEY}`)
        const plantsData = await response.json()
        res.json(plantsData)
    } catch (err) {
        res.status(500).send({ error: 'Error fetching plants' })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
