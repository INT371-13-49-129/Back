module.exports = (sequelize, Sequelize) => {
    const topic = sequelize.define(
      "topic",
      {
        topic_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: Sequelize.STRING,
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
    return topic;
  };
  