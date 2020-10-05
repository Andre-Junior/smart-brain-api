const handleSignin = (req, res, db, bcrypt) => {
    const {email, password} = req.body
    if( !email || !password ) {
        return res.status(400).json('Login incorreto')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if (isValid) {
            return db.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('Não foi possivel fazer login! Email ou senha incorretos!'))
        } else {
            res.status(400).json('Email ou senha incorretos!')
        }
    })
    .catch(err => res.status(400).json('Email ou senha incorretos!'))
}

module.exports = {
    handleSignin
}