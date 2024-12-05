import express from 'express'
import fetch from 'node-fetch'
import cors from 'cors'


const app = express()
const port = 3000

export const API_KEY = 'sk-vyul675055b67af1b7886'


app.use(cors())

app.get('/api/plants', async (req, res) => {
    try {
        const response = await fetch(`https://perenual.com/api/species-list?key=${API_KEY}`)
        const plantsData = await response.json()
        res.json(plantsData)
    } catch (err) {
        res.status(500).send({ error: 'Error fetching plants' })
    }
})

app.get('/api/plants/:id', async (req, res) => {
    const { id } = req.params
    try {
        const response = await fetch(`https://perenual.com/api/species/details/${id}?key=${API_KEY}`)
        const plantData = await response.json()
        res.json(plantData)
    } catch (err) {
        res.status(500).send({ error: 'Error fetching plant details' })
    }
})



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
