'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      question.belongsTo(models.election,{
        foreignKey:"electionId"
      })
      // define association here
    }

    
  static async getquestions(id) {
    return await question.findAll({
      where: {
        electionId: id,
      },
    });
  }
  }

  question.init({
    qId: DataTypes.INTEGER,
    qname: DataTypes.STRING,
    qDesc: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'question',
  });
  return question;
};