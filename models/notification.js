module.exports = (sequelize, Sequelize) => {
  const notification = sequelize.define(
    "notification",
    {
      notification_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      message: Sequelize.JSON,
      notification_type: Sequelize.JSON,
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
  return notification;
};
