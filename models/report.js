module.exports = (sequelize, Sequelize) => {
    const report = sequelize.define(
      "report",
      {
        report_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        message: Sequelize.TEXT,
        message_system: Sequelize.JSON,
        report_type: {
            type: Sequelize.ENUM,
            allowNull: false,
            defaultValue: "User",
            values: ["User","System"],
          },
        report_status: {
            type: Sequelize.ENUM,
            allowNull: false,
            defaultValue: "Managed",
            values: ["Managed","Reject","Waiting"],
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
    return report;
  };
  