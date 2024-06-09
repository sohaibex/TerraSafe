// models/Earthquake.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Earthquake extends Model { }

Earthquake.init({
    location: DataTypes.STRING,
    magnitude: DataTypes.DECIMAL(10, 2),
    depth: DataTypes.DECIMAL(10, 2),
    occurrence_time: DataTypes.DATE
}, { sequelize, modelName: 'earthquake' });

module.exports = Earthquake;
