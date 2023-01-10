'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.hasMany(models.election,{
        foreignKey:'AdminId',
      })
      // define association here
    }
  }
  Admin.init({
    fname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        len: {
          args: 1,
          msg: "Proper first name required!",
        },
      },
    },
    lname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email already exists",
      },
    },

    password:{
        type: DataTypes.STRING,
        allowNull: false,
  },
},
   
  {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};