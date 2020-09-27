const express = require('express');

const app = express();

app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john.1@gmail.com',
            passaword: 'sla123sla',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally.sally@gmail.com',
            passaword: 'sla321',
            entries: 0,
            joined: new Date()
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.passaword === database.users[0].passaword) {
        res.json('Sucesso')
    } else {
        res.status(400).json('Login incorreto')
    }
})

app.post('/register', (req,res) => {
    const { email, name, passaword} = req.body
    database.users.push({
            id: '125',
            name: name,
            email: email,
            passaword: passaword,
            entries: 0,
            joined: new Date()
    })
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


app.listen(4000, () => {
    console.log('O servidor esta funcionando na porta 4000')
})