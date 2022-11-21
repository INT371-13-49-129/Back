module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define(
      "post",
      {
        post_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: Sequelize.STRING,
        owner: Sequelize.STRING,
        text: Sequelize.TEXT,
        img: Sequelize.JSON,
        cover_image_url: Sequelize.STRING,
        count_read: {
          type:Sequelize.INTEGER,
          defaultValue: 0,
        },
        post_type: {
          type: Sequelize.ENUM,
          allowNull: false,
          defaultValue: "Post",
          values: ["Post","Article"],
        },
        post_status: {
          type: Sequelize.ENUM,
          allowNull: false,
          defaultValue: "Upload",
          values: ["Upload","Reject","Waiting"],
        },
        publish_status: {
          type: Sequelize.ENUM,
          defaultValue: "Publish",
          values: ["Publish", "Personal"],
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
    return Post;
  };
  