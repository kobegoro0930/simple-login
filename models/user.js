'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  User.init({
    name: DataTypes.STRING,
    mail: DataTypes.STRING,
    pass: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
