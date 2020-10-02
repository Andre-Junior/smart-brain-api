const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //localhost
      user : 'postgres',
      password : '123',
      database : 'smart_brain'
    }
});


const app = express();

app.use(express.json());
app.use(cors())

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            password: 'fruta',
            email: 'john.1@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            password: 'verduras',
            email: 'sally.sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john.1@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('Login incorreto')
    }
})

app.post('/register', (req,res) => {
    const { email, name, password} = req.body
   db('users').insert({
       email: email,
       name: name,
       joined: new Date()
   }).then(console.log)
    res.json(database.users[database.users.length-1])
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true
            return res.json(user)
        }
    })
    if (!found) {
        res.status(400).json('Usuário não encontrado!')
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true
            user.entries++
            return res.json(user.entries)
        }
    })
    if (!found) {
        res.status(400).json('Usuário não encontrado!')
    }
})


app.listen(3000, () => {
    console.log('O servidor esta funcionando na porta 3000')
})