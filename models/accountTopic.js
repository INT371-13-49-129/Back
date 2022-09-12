module.exports = (sequelize, Sequelize) => {
    const account_topic = sequelize.define(
      "account_topic",
      {
        account_topic_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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
    return account_topic;
  };
  