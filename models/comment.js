module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define(
      "comment",
      {
        comment_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        text: Sequelize.TEXT,
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
    return Comment;
  };
  