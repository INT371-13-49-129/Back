module.exports = (sequelize, Sequelize) => {
    const post_tag = sequelize.define(
      "post_tag",
      {
        post_tag_id: {
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
    return post_tag;
  };
  