require('../models')
const sequelize = require('../utils/connection');

const postMigrate = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("DB reset exit");
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

postMigrate();