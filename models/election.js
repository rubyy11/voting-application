'use strict';
const {
  Model
} = require('sequelize');
const admin = require('./admin');
module.exports = (sequelize, DataTypes) => {
  class election extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      election.belongsTo(models.Admin,{
        foreignKey:'AdminId'
      })
      // define association here
    }
    static addElection({ electionName,AdminId }) {
      console.log("bjhbvhzdczv")
      return this.create({
        electionName:electionName,
        electionStatus:false,
        AdminId:AdminId

        
      });
    }
//deleteing an election
    static async remove(id) {
      return await this.destroy({
        where: {
          id,
        },
      });
    }

    static getElection(AdminId){
      return election.findAll(
        {where:{
          AdminId
        }}
      );

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
