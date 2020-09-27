const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('sla')
})

app.listen(4000, () => {
    console.log('O servidor esta funcionando na porta 4000')
})