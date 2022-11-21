module.exports = (sequelize, Sequelize) => {
    const request = sequelize.define(
      "request",
      {
        request_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        text: Sequelize.STRING,
        request_status: {
            type: Sequelize.ENUM,
            allowNull: false,
            defaultValue: "Waiting",
            values: ["Waiting","Accept","Reject"],
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
    return request;
  };
  