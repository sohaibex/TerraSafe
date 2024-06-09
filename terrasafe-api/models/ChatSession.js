// models/ChatSession.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class ChatSession extends Model { }

ChatSession.init({
    session_data: DataTypes.TEXT
}, { sequelize, modelName: 'chatSession' });

ChatSession.belongsTo(User);  // Set up a foreign key reference to the User model

module.exports = ChatSession;
