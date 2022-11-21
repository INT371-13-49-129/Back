module.exports = (sequelize, Sequelize) => {
  const account_read = sequelize.define(
    "account_read",
    {
      account_read_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      last_read: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
     },
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return account_read;
};
