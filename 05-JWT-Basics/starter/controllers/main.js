const login = (req, res) => {
    res.send('Fake Login/Register/Signup Route')
}

const dashboard = (req, res) => {
    const luckyNumber = Math.floor(Math.random()*100)
    res.status(200).json({msg: `Hello, Ktie`, secret: `Here is ur secret data. Your lucky number is ${{luckyNumber}}` })
}

module.exports = {login, dashboard}