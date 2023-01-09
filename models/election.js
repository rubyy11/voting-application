'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class election extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static addElection({ electionName }) {
      console.log("bjhbvhzdczv")
      return this.create({
        electionName:electionName,
        electionStatus:false,
        
      });
    }

    static getElection(){
      return election.findAll();
    }

  }
  
  election.init({
    electionStatus: DataTypes.BOOLEAN,
    electionName: DataTypes.STRING,
    electionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'election',
  });

 
  return election;

 
};