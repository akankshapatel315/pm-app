'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex('entries', ['user_id', 'date'], {
      unique: true,
      name: 'entries_user_id_date_unique',
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE "entries" ADD CONSTRAINT "entries_hours_range_check" CHECK ("hours" >= 1 AND "hours" <= 24);'
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'ALTER TABLE "entries" DROP CONSTRAINT "entries_hours_range_check";'
    );
    await queryInterface.removeIndex('entries', 'entries_user_id_date_unique');
  },
};
