// models/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model { }

User.init({
    username: DataTypes.STRING,
    location: DataTypes.STRING
}, { sequelize, modelName: 'user' });

module.exports = User;
