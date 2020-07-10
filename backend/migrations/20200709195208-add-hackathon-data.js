/* eslint-disable no-unused-vars */

const Hackathon = require('../api/models/Hackathon');
const moment = require('moment');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await Hackathon.create({
      name: 'UNO-JULY-2020',
      startDate: moment().subtract('10', 'days').format(('YYYY-MM-DD HH:mm')),
      endDate: moment().add('10', 'days').format(('YYYY-MM-DD HH:mm')),
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, _Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
