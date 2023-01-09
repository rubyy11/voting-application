"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("options", "qId", {
      type: Sequelize.DataTypes.INTEGER,
    });

    
    await queryInterface.sequelize.query(
      'ALTER TABLE "options" ADD CONSTRAINT "Options_questionId_Questions_fk" FOREIGN KEY ("qId") REFERENCES "questions" (id) MATCH SIMPLE ON DELETE CASCADE'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("options", "qId");
  },
};