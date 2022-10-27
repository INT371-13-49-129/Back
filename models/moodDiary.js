module.exports = (sequelize, Sequelize) => {
  const mood_diary = sequelize.define(
    "mood_diary",
    {
      mood_diary_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: Sequelize.DATEONLY,
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
  return mood_diary;
};
