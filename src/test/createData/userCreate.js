const User = require("../../models/User")

const userCreate = async () => {
    await User.create(
        {
            firstName: "Miguel",
            lastName: "Ticona",
            email: "miguel@gmail.com",
            password: "12345",
            phone: "+123456789"

        }
    )}

module.exports = userCreate