module.exports = (sequelize, Sequelize) => {
    const message_connect = sequelize.define(
      "message_connect",
      {
        message_connect_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        last_messages: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
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
    return message_connect;
  };
  