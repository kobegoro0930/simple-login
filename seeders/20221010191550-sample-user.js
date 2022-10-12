'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Roger Federer',
        mail: 'roger@king.com',
        pass: 'password',
        message: 'I love Tennis',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Shohei Ohtani',
        mail: 's-ohtani@angels.com',
        pass: 'password',
        message: 'I love Baseball',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
