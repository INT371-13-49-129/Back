module.exports = (sequelize, Sequelize) => {
    const message = sequelize.define(
      "message",
      {
        message_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        text: Sequelize.TEXT,
        is_read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        is_delete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        }
      },
      {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
      }
    );
    return message;
  };
  