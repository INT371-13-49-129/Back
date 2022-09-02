module.exports = (sequelize, Sequelize) => {
    const log_edit = sequelize.define(
      "log_edit",
      {
        log_edit_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        log_data: Sequelize.JSON,
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
    return log_edit;
  };
  