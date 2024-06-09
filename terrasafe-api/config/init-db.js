// db/init-db.js
const sequelize = require('./database');
const User = require('../models/User');
const Earthquake = require('../models/Earthquake');
const ChatSession = require('../models/ChatSession');

const initDb = async () => {
    try {
        await sequelize.sync({ force: true });  // Use { force: false } to avoid dropping tables
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

initDb();
