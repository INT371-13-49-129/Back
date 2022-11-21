module.exports = (sequelize, Sequelize) => {
    const follow = sequelize.define(
      "follow",
      {
        follow_id: {
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
    return follow;
  };
  