const clarifai = require('clarifai')
const { json } = require('express')

const app = new Clarifai.App({
    apiKey: '5e1d1b5f932140538e44665c7275d98e'
})

const handleApiCall = (req, res) => {
    app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data)
    })
    .catch(err => res.status(400).json('Incapaz de trabalhar com a API'))
}


const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Incapaz de obter a contagem'))
}

module.exports = {
    handleImage,
    handleApiCall
}