module.exports = (sequelize, Sequelize) => {
  const diary = sequelize.define(
    "diary",
    {
      diary_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: Sequelize.DATEONLY,
      title: Sequelize.STRING,
      text: Sequelize.TEXT,
      is_delete: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return diary;
};
