const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const { response } = require('express');

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
   db('users')
   .returning('*')   
   .insert({
       email: email,
       name: name,
       joined: new Date()
   })
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('Não foi possivel o registro!'))
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if(user.length){
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