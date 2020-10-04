const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1', //localhost
        user: 'postgres',
        password: '123',
        database: 'smart_brain'
    }
});


const app = express();

app.use(express.json());
app.use(cors())


app.get('/', (req, res) => {
    /* res.send(database.users) */
})

app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        if (isValid) {
            return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Não foi possivel fazer login! Email ou senha incorretos!'))
        } else {
            res.status(400).json('Email ou senha incorretos!')
        }
    })
    .catch(err => res.status(400).json('Email ou senha incorretos!'))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body
    const hash = bcrypt.hashSync(password)
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(err => res.status(400).json('Não foi possivel o registro!'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Usuário não encontrado')
            }
        })
        .catch(err => res.status(400).json('Erro ao obter usuário'))
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0])
        })
        .catch(err => res.status(400).json('Incapaz de obter a contagem'))
})


app.listen(3000, () => {
    console.log('O servidor esta funcionando na porta 3000')
})