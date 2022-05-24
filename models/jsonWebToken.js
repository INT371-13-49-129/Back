module.exports = (sequelize, Sequelize) => {
    const json_web_token = sequelize.define(
      "json_web_token",
      {
        json_web_token_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        token_type: {
            type: Sequelize.ENUM,
            values: ["ConfirmEmail","Logout"],
        },
        token: Sequelize.STRING,
        exp: Sequelize.DATE,
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
    return json_web_token;
  };
  