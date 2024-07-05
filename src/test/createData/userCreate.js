const User = require('../../models/User')


const createUser = async() => {
    const body = {
        firstName: "Miguel",
        lastName: "Ticona",
        email: "miguel@gmail.com",
        password: "12345",
        phone: "+987654789"
    }
    
    await User.create(body)
}

module.exports = {createUser}