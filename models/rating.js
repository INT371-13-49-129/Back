module.exports = (sequelize, Sequelize) => {
    const rating = sequelize.define(
      "rating",
      {
        rating_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        review: Sequelize.TEXT,
        rating_score: Sequelize.INTEGER,
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
    return rating;
  };
  