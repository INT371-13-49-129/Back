module.exports = (sequelize, Sequelize) => {
    const Tag = sequelize.define(
      "tag",
      {
        tag_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: Sequelize.STRING,
        tag_type: {
          type: Sequelize.ENUM,
          values: ["Feeling","Category","Article"],
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
    return Tag;
  };
  