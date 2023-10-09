const register = async (req, res) => {
    req.send('register user')
}

const login = async (req, res) => {
    req.send('login user')
}

module.exports = {
    register,
    login,
}